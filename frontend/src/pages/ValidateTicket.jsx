import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Loader2, ScanLine } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ValidateTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthorized = user && (user.type === 'STAFF' || user.type === 'ADMIN');

  const handleConsumeTicket = async () => {
    setStatus('loading');
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/tickets/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: parseInt(id), status: 'USED' })
      });

      if (!response.ok) throw new Error("Failed to validate ticket. It may already be used.");

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-black">Unauthorized</h1>
        <p className="text-muted-foreground mt-2">Only staff accounts can validate tickets.</p>
        <button onClick={() => navigate('/login')} className="mt-6 text-primary font-bold">Switch Account</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-[2rem] shadow-2xl border border-border text-center">

        {status === 'success' ? (
          <div className="animate-in zoom-in duration-300">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black tracking-tight text-foreground">Ticket Validated!</h2>
            <p className="text-muted-foreground mt-2">The ticket has been consumed.</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ScanLine className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-black tracking-tight mb-2">Validate Ticket #{id}</h2>
            <p className="text-sm text-muted-foreground mb-8">Confirm the physical exchange of the meal before pressing consume.</p>

            {error && (
              <div className="p-4 mb-6 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-sm font-bold text-destructive">{error}</p>
              </div>
            )}

            <button
              onClick={handleConsumeTicket}
              disabled={status === 'loading'}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CONSUME TICKET'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
