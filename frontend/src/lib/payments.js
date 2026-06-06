const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createTicketPaymentIntent = async (dishId, scheduledDate, amount) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      dishId,
      scheduledDate,
      amount
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to initialize payment');
  }

  return data;
};
