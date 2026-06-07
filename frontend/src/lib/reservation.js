const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createReservation = async (reservationData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reservationData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to create reservation.');
  return data;
};

export const getAllReservations = async () => {
  const response = await fetch(`${API_URL}/api/reservations`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch reservations.');
  return data;
};

export const getReservationsByUser = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/reservations/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch reservations for this user.');
  return data;
};

export const updateReservationStatus = async (id, status) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/reservations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update reservation status.');
  return data;
};

export const validateReservation = async (reservationId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/reservations/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ qrToken: reservationId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Validation failed');
  return data;
};

export const getAccessLogs = async () => {
  const response = await fetch(`${API_URL}/api/reservations/accesslogs`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error("Failed to fetch logs");
  return response.json();
};
