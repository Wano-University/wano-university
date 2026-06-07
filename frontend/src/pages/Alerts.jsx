import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  AlertTriangle,
  Loader2,
  Thermometer,
  Zap,
  Wind
} from 'lucide-react';

import {
  getPendingAlerts,
  resolveAlert
} from '../lib/sensors';

export default function Alerts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const data = await getPendingAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    const interval = setInterval(() => {
      loadAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'TEMPERATURE':
        return <Thermometer className="w-5 h-5" />;
      case 'ENERGY_CONSUMPTION':
        return <Zap className="w-5 h-5" />;
      case 'AIR_QUALITY':
        return <Wind className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);

      setAlerts(prev =>
        prev.filter(alert => alert.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-lg p-6 rounded-[2rem] shadow-2xl border flex flex-col max-h-[85vh]"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 p-2 bg-muted/50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-muted-foreground/10 rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
            <Bell className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black">
            Sensor Alerts
          </h2>

          <p className="text-sm text-muted-foreground">
            Sensors currently exceeding limits.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl">
              <p className="font-bold">
                No Active Alerts
              </p>
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id.toString()}
                className="border border-muted-foreground/30 bg-muted-foreground/5 rounded-2xl p-4"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/10 flex items-center justify-center">
                    {getIcon(alert.sensor.type)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold">
                      {alert.sensor.space}
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>

                    <p className="text-xs mt-2 text-muted-foreground">
                      {new Date(
                        alert.alertDate
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleResolve(alert.id)
                  }
                  className="mt-4 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold cursor-pointer"
                >
                  Mark as Resolved
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
