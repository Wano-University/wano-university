import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { t } = useTranslation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cafeteria`,
      },
      redirect: "if_required" // THIS IS CRITICAL: Stops the page from forcefully reloading
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ intentId: paymentIntent.id })
        });

        if (!response.ok) throw new Error("Failed to finalize ticket in database.");

        alert("Payment successful! Your ticket has been saved.");

        window.location.reload();

      } catch (err) {
        console.error(err);
        setErrorMessage("Payment charged, but database update failed. Please contact support.");
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {errorMessage && (
        <div className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full py-3 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> {t('CheckOutFinal')}
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
}
