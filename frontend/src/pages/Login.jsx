import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Field, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import lgimg from '@/assets/wanouni.png';
import smimg from '@/assets/wanoportrait.png';
import logoimg from '@/assets/logowanouni.png';
import { loginUser } from '../lib/auth';
import { useTranslation } from "react-i18next";


export default function Login() {
  const [status, setStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation();


  const login = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const credentials = {
      login: formValues.login,
      password: formValues.password,
      rememberMe: rememberMe
    };

    try {
      const data = await loginUser(credentials);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setStatus('success');

      setTimeout(() => {
        window.location.href = '/home';
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      setStatus('error');

      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen"
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="fixed inset-0 w-screen h-screen">

        <img
          src={lgimg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 backdrop-blur-[100px]" />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Card className="w-full p-0 max-w-6xl shadow-lg border-border overflow-hidden">
            <div className="flex h-150">

              <div className="flex-1 p-10 flex flex-col justify-center items-center md:items-start">
                <img src={logoimg} alt="Wano University" className="w-20 h-20 mb-6 rounded-full" />
                <h1 className="text-2xl font-bold mb-6">{t('LoginTitle')}</h1>

                <form onSubmit={login} className="w-full space-y-4">
                  <Field>
                    <FieldLabel htmlFor="login">Login:</FieldLabel>
                    <Input id="login" name="login" type="text" required />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">{t('LoginPass')}:</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-primary"
                      />
                      {t('LoginRemember')}
                    </label>
                    <a href="/changepw" className="text-muted-foreground hover:text-foreground">
                      {t('LoginForgot')}
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full mt-2"
                  >
                    {status === 'loading' && 'Logging in...'}
                    {status === 'success' && 'Success ✓'}
                    {status === 'error' && 'Error. Try Again.'}
                    {status === 'idle' && 'Login'}
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
    </motion.div>
  );
}
