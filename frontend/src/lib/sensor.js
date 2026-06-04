const API_URL = import.meta.env.VITE_API_URL;

export const registerSensor = async (sensorData) => {
  const response = await fetch(`${API_URL}/api/sensors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sensorData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register sensor.');
  return data;
};

export const getAllSensors = async () => {
  const response = await fetch(`${API_URL}/api/sensors`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors.');
  return data;
};

export const getSensorsByFloor = async (floor) => {
  const response = await fetch(`${API_URL}/api/sensors/floor/${floor}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by floor.');
  return data;
};

export const getSensorsByType = async (type) => {
  const response = await fetch(`${API_URL}/api/sensors/type/${type}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by type.');
  return data;
};

export const updateSensorStatus = async (id, isActive) => {
  const response = await fetch(`${API_URL}/api/sensors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update status.');
  return data;
};

export const getAlerts = async (id) => {
  const response = await fetch(`${API_URL}/api/sensors/${id}/alerts`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getReadings = async (id) => {
  const response = await fetch(`${API_URL}/api/sensors/${id}/readings`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};

export const getAllAlerts = async () => {
  const response = await fetch(`${API_URL}/api/sensors/data/alerts`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getAllReadings = async () => {
  const response = await fetch(`${API_URL}/api/sensors/data/readings`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};