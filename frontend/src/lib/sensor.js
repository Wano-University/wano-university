const API_URL = import.meta.env.VITE_API_URL;

export const registerSensor = async (sensorData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(sensorData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register sensor.');
  return data;
};

export const getAllSensors = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors.');
  return data;
};

export const getSensorsByFloor = async (floor) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/floor/${floor}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by floor.');
  return data;
};

export const getSensorsByType = async (type) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/type/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by type.');
  return data;
};

export const updateSensorStatus = async (id, isActive) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update status.');
  return data;
};

export const getAlerts = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/${id}/alerts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getReadings = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/${id}/readings`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};

export const getAllAlerts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/data/alerts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getAllReadings = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/sensors/data/readings`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};