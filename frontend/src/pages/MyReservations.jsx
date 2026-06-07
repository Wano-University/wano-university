import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, CalendarClock, Loader2, Key, Car, Monitor } from 'lucide-react';
import { getReservationsByUser } from '../lib/reservation';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { useTranslation } from "react-i18next";


export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQRUrl, setSelectedQRUrl] = useState(null);
  const [pollingId, setPollingId] = useState(null);
  const { t } = useTranslation();


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?.id) throw new Error("User session not found.");

        const rawData = await getReservationsByUser(storedUser.id);

        const now = new Date();
        const active = rawData.filter(res =>
          res.status === 'ACTIVE' && new Date(res.endTime) > now
        );

        setReservations(active);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load your reservations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    if (!pollingId) return;
    const checkStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        const rawData = await getReservationsByUser(storedUser.id);
        const res = rawData.find(r => r.id === pollingId);

        if (res && res.status === 'COMPLETED') {
          setSelectedQRUrl(null);
          setPollingId(null);
          window.location.reload();
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [pollingId]);

  const getResourceDetails = (res) => {
    if (res.mobilityResource) return { name: res.mobilityResource.identifier, icon: <Car />, type: 'Vehicle' };
    if (res.resource?.type === 'EQUIPMENT') return { name: res.resource.name, icon: <Monitor />, type: 'Equipment' };
    return { name: res.resource?.name || 'Room', icon: <Key />, type: 'Space' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-lg p-6 rounded-[2rem] shadow-2xl relative border flex flex-col max-h-[85vh]"
      >
        <button onClick={() => navigate(-1)} className="absolute top-5 right-5 p-2 bg-muted/50 rounded-full z-10 cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <CalendarClock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{t('ResActive')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('ResSelect')}</p>
        </div>

        <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive font-bold text-center rounded-xl">{error}</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/10">
              <p className="font-bold text-foreground">{t('ResNoActive')}</p>
            </div>
          ) : (
            reservations.map((res) => {
              const details = getResourceDetails(res);
              const startDate = new Date(res.startTime);
              const isReadyToUnlock = new Date() >= new Date(startDate.getTime() - 5 * 60000);

              return (
                <div
                  key={res.id}
                  onClick={() => {
                    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
                    setSelectedQRUrl(`${baseUrl}/validate-reservation/${res.id}`);
                    if (details.type === 'Equipment') setPollingId(res.id);
                  }}
                  className={`p-4 border rounded-2xl flex items-center gap-4 transition-all cursor-pointer ${isReadyToUnlock ? 'border-primary/40 bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 text-foreground">
                    {details.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold truncate text-foreground">{details.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!isReadyToUnlock && details.type !== 'Equipment' && (
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Wait</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {selectedQRUrl && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={() => { setSelectedQRUrl(null); setPollingId(null); }} />
            <div className="relative z-10 flex flex-col items-center">
              <QRCodeDisplay url={selectedQRUrl} title="Scan for Access/Checkout" />
              <button onClick={() => { setSelectedQRUrl(null); setPollingId(null); }} className="mt-6 w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
