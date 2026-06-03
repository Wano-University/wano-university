const API_URL = import.meta.env.VITE_API_URL;

export const registerSensorAPI = async (sensorData) => {
  const response = await fetch(`${API_URL}/api/registerSensor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sensorData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register sensor.');
  return data;
};

export const getSensorsByFloorAPI = async (floor) => {
  const response = await fetch(`${API_URL}/api/getSensorsByfloor/${floor}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by floor.');
  return data;
};

export const updateSensorStatusAPI = async (id, isActive) => {
  const response = await fetch(`${API_URL}/api/sensorStatus/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update status.');
  return data;
};

export const getAllSensorsAPI = async () => {
  const response = await fetch(`${API_URL}/api/getAllSensors`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors.');
  return data;
};

export const getSensorsByTypeAPI = async (type) => {
  const response = await fetch(`${API_URL}/api/getSensorsByType/${type}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch sensors by type.');
  return data;
};

export const getAlertsAPI = async (id) => {
  const response = await fetch(`${API_URL}/api/getAlerts?id=${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getReadingsAPI = async (id) => {
  const response = await fetch(`${API_URL}/api/getReadings?id=${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};

export const getAllAlertsAPI = async () => {
  const response = await fetch(`${API_URL}/api/getAllAlerts`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load alerts.');
  return data;
};

export const getAllReadingsAPI = async () => {
  const response = await fetch(`${API_URL}/api/getAllReadings`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load readings.');
  return data;
};