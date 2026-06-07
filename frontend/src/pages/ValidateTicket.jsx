import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Loader2, ScanLine } from 'lucide-react';
import { validateTicket } from '../lib/tickets';
import { useTranslation } from "react-i18next";


export default function ValidateTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthorized = user && (user.type === 'STAFF' || user.type === 'ADMIN');

  const handleUseTicket = async () => {
    setStatus('loading');
    setError(null);

    try {
      await validateTicket(id);
      setStatus('success');
    } catch (err) {
      setError(err.message || "Failed to validate ticket. It may already be used.");
      setStatus('error');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-black">{t('ValT')}</h1>
        <p className="text-muted-foreground mt-2">{t('ValTStaff')}</p>
        <button onClick={() => navigate('/login')} className="mt-6 text-primary font-bold">{t('ValTSwitch')}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-[2rem] shadow-2xl border border-border text-center">

        {status === 'success' ? (
          <div className="animate-in zoom-in duration-300">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black tracking-tight text-foreground">{t('ValTValidate')}</h2>
            <p className="text-muted-foreground mt-2">{t('ValTUsed')}</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ScanLine className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-black tracking-tight mb-2">{t('ValTTicket')} #{id}</h2>
            <p className="text-sm text-muted-foreground mb-8">{t('ValTPhysical')}</p>

            {error && (
              <div className="p-4 mb-6 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-sm font-bold text-destructive">{error}</p>
              </div>
            )}

            <button
              onClick={handleUseTicket}
              disabled={status === 'loading'}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'USE TICKET'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
