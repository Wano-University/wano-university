import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, History, Loader2, User, MapPin, Monitor } from 'lucide-react';
import { getAccessLogs } from '../lib/reservation';
import { useTranslation } from "react-i18next";


export default function AccessLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();


  const loadLogs = async () => {
    try {
      const data = await getAccessLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-lg p-6 rounded-[2rem] shadow-2xl border flex flex-col max-h-[85vh]"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 p-2 bg-muted/50 rounded-full cursor-pointer hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black">{t('ALTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('ALDesc')}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground font-bold">{t('ALAcc')}</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="border border-border bg-muted/20 rounded-2xl p-4 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shrink-0">
                  {log.resourceType === 'EQUIPMENT' ? <Monitor className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{log.resourceName}</h4>
                  <p className="text-sm text-muted-foreground truncate">{t('ALUser')}: {log.userName}</p>
                  <p className="text-xs mt-1 font-mono text-primary">
                    {new Date(log.accessDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
