import React from 'react';
import { MapPinOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export default function NotFound() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border-border shadow-2xl shadow-primary/5">

        <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
          <MapPinOff className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-foreground">
            404
          </h1>
          <h2 className="text-xl font-bold text-foreground">
            {t('NotFPage')}
          </h2>
          <p className="text-muted-foreground font-medium">
            {t('NotFNoFind')}
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <Link
            to="/home"
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('NotFReturn')}
          </Link>
        </div>

      </Card>
    </div>
  );
}
