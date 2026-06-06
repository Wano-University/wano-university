const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getMyTickets = async (userId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/tickets/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch tickets');
  return data;
};

export const validateTicket = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/tickets/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id: parseInt(id), status: 'USED' })
  });
  if (!response.ok) throw new Error('Failed to validate ticket');
  return response.json();
};
