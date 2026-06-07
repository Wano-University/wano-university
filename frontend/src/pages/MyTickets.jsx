import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, TicketCheck, Loader2, UtensilsCrossed, Calendar } from 'lucide-react';
import { getMyTickets } from '../lib/tickets';
import { getImageUrl } from '../lib/utils';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { useTranslation } from "react-i18next";


export default function MyTickets() {
  const navigate = useNavigate();
  const [groupedTickets, setGroupedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicketUrl, setSelectedTicketUrl] = useState(null);
  const [pollingTicketId, setPollingTicketId] = useState(null);
  const [isScanSuccessful, setIsScanSuccessful] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedTicketUrl) {
          setSelectedTicketUrl(null);
          setPollingTicketId(null);
        } else {
          navigate(-1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setSelectedTicketUrl, setPollingTicketId]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || !user.id) {
          throw new Error("User session not found.");
        }

        const rawTickets = await getMyTickets(user.id);

        const grouped = rawTickets.reduce((acc, ticket) => {
          if (ticket.status !== 'ACTIVE') return acc;

          const dishId = ticket.dishId;

          if (!acc[dishId]) {
            acc[dishId] = {
              dish: ticket.dish,
              scheduledDate: ticket.scheduledDate,
              count: 1,
              ticketIds: [ticket.id]
            };
          } else {
            acc[dishId].count += 1;
            acc[dishId].ticketIds.push(ticket.id);
          }
          return acc;
        }, {});

        setGroupedTickets(Object.values(grouped));

      } catch (err) {
        console.error("Failed to load tickets:", err);
        setError("Could not load your tickets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (!pollingTicketId) return;

    const checkTicketStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const rawTickets = await getMyTickets(storedUser.id);

        const ticket = rawTickets.find(t => t.id === pollingTicketId);

        if (ticket && ticket.status === 'USED') {
          setIsScanSuccessful(true);

          setTimeout(() => {
            setIsScanSuccessful(false);
            setSelectedTicketUrl(null);
            setPollingTicketId(null);

            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const intervalId = setInterval(checkTicketStatus, 2000);

    return () => clearInterval(intervalId);
  }, [pollingTicketId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-[2rem] shadow-2xl relative border border-border flex flex-col max-h-[85vh]"
      >

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 p-2 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary border border-primary/20">
            <TicketCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{t('TicketMy')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('TicketSelect')}</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">{t('TicketLoading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 px-4 bg-destructive/10 rounded-2xl border border-destructive/20">
              <p className="text-sm font-bold text-destructive">{error}</p>
            </div>
          ) : groupedTickets.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
              <UtensilsCrossed className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <h4 className="text-base font-bold text-foreground">{t('TicketNo')}</h4>
              <p className="text-sm text-muted-foreground max-w-[200px] mt-1">{t('TicketNoActive')}</p>
            </div>
          ) : (
            groupedTickets.map((group, index) => {
              const dishDate = new Date(group.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <div
                  key={index}
                  onClick={() => {
                    const activeTicketId = group.ticketIds[0];
                    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
                    const validationUrl = `${baseUrl}/validate-ticket/${activeTicketId}`;
                    setSelectedTicketUrl(validationUrl);
                    setPollingTicketId(activeTicketId)
                  }}
                  className="p-3 border border-border rounded-2xl flex items-center justify-between gap-4 bg-background hover:bg-primary/5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/10 bg-muted shrink-0">
                      {group.dish?.image ? (
                        <img
                          src={getImageUrl(group.dish.image)}
                          alt={group.dish.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 m-auto mt-4 text-muted-foreground/30" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                        {group.dish?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {dishDate}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-black tracking-widest">
                      x{group.count}
                    </span>
                  </div>
                </div>
              )
            })
          )}

        </div>
        {/* QR Code Overlay */}
        {selectedTicketUrl && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
              onClick={() => { setSelectedTicketUrl(null); setPollingTicketId(null); }}
            />

            <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-200">

              {/* If successful, show the checkmark. Otherwise, show the QR Code */}
              {isScanSuccessful ? (
                <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-green-200 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-24 h-24 text-green-500 mb-4" />
                  <h2 className="text-2xl font-black text-foreground">{t('TicketRedeem')}</h2>
                  <p className="text-muted-foreground mt-1">{t('TicketMsg')}</p>
                </div>
              ) : (
                <>
                  <QRCodeDisplay url={selectedTicketUrl} title="Show this to Staff" />
                  <button
                    onClick={() => { setSelectedTicketUrl(null); setPollingTicketId(null); }}
                    className="mt-6 w-full max-w-[200px] py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    {t('TicketClose')}
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </motion.div >
    </div >
  );
}
