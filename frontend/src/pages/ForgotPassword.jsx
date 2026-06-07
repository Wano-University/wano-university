import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Field, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import lgimg from '@/assets/wanouni.png';
import smimg from '@/assets/wanoportrait.png';
import logoimg from '@/assets/logowanouni.png';
import { resetPassword } from '../lib/auth';
import { useTranslation } from "react-i18next";


export default function ChangePassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    if (formValues.newPassword !== formValues.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const payload = {
      login: formValues.login,
      email: formValues.email,
      newPassword: formValues.newPassword
    };

    try {
      await resetPassword(payload);

      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Failed to reset password.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen">

      <img
        src={lgimg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 backdrop-blur-[100px]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <Card className="w-full p-0 max-w-6xl shadow-lg border-border overflow-hidden">
          <div className="flex h-[600px]">

            <div className="flex-1 p-10 flex flex-col justify-center items-center md:items-start overflow-y-auto">
              <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft size={16} /> {t('ForgotPasswordBack')}
              </Link>

              <img src={logoimg} alt="Wano University" className="w-16 h-16 mb-4 rounded-full" />
              <h1 className="text-2xl font-bold mb-2">{t('ForgotPasswordTitle')}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t('ForgotPasswordDesc')}</p>

              <form onSubmit={handlePasswordReset} className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="login">{t('ForgotPasswordLogin')}:</FieldLabel>
                    <Input id="login" name="login" type="text" required />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">{t('ForgotPasswordEmail')}:</FieldLabel>
                    <Input id="email" name="email" type="email" required />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="newPassword">{t('ForgotPasswordNewPass')}:</FieldLabel>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">{t('ForgotPasswordConfirmPass')}:</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>

                {errorMessage && (
                  <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full mt-2"
                >
                  {status === 'loading' && 'Verifying...'}
                  {status === 'success' && 'Password Updated ✓'}
                  {status === 'error' && 'Error. Try Again.'}
                  {status === 'idle' && t('ForgotPasswordButton')}
                </Button>
              </form>
            </div>

            <div className="hidden md:block w-1/2 h-full overflow-hidden">
              <img src={smimg} alt="" className="w-full h-full object-cover object-center" />
            </div>

          </div>
        </Card>
      </div>

    </div>
  );
}
