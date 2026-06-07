import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, KeyRound, Loader2, Check } from 'lucide-react';
import { changePW } from '../lib/auth';
import { useTranslation } from "react-i18next";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    if (formValues.newPassword !== formValues.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.login) {
      setErrorMessage('Session expired. Please log in again.');
      setStatus('error');
      return;
    }

    const payload = {
      login: user.login,
      password: formValues.oldPassword,
      newPassword: formValues.newPassword
    };

    try {
      await changePW(payload);
      setStatus('success');

      setTimeout(() => {
        navigate(-1);
      }, 1500);

    } catch (error) {
      console.error('Change password error:', error);
      setErrorMessage(error.message || 'Failed to change password.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">

      <div className="bg-card text-card-foreground w-full max-w-md p-8 rounded-3xl shadow-2xl relative border border-border">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">{t('ChangePass')}</h3>
          <p className="text-sm text-muted-foreground">{t('ChangePassCredencials')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t('ChangePassCurrentPass')}</label>
            <div className="relative">
              <input
                name="oldPassword"
                type={showOld ? 'text' : 'password'}
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all pr-10"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground">{t('ChangePassNewPass')}</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t('ChangePassConfirm')}</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all pr-10"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs font-bold text-destructive text-center pt-2">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full mt-4 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' && <Check className="w-5 h-5" />}

            {status === 'loading' ? 'Updating...' :
              status === 'success' ? 'Password Changed!' :
                'Update Password'}
          </button>

        </form>
      </div>
    </div>
  );
}
