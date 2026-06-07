import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Unauthorized() {
  const navigate = useNavigate();

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
      <Card className="max-w-md w-full p-8 text-center space-y-6 border-destructive/20 shadow-2xl shadow-destructive/10">
        <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            You don't have enough permissions
          </h1>
          <p className="text-muted-foreground font-medium">
            You do not have the necessary permissions to view this page. If you believe this is an error, please contact the Wano University IT administration.
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <Link
            to="/home"
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Home Page
          </Link>
        </div>
      </Card>
    </div>
  );
}