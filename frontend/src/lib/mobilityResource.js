const API_URL = import.meta.env.VITE_API_URL;

export const registerMobilityResource = async (mobilityData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/mobility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(mobilityData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register mobility resource.');
  return data;
};

export const getAllMobilityResources = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/mobility`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch mobility resources.');
  return data;
};

export const getMobilityResourcesByType = async (type) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/mobility/type/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch mobility resources by type.');
  return data;
};

export const updateMobilityStatus = async (id, status) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/mobility/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }), 
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update mobility resource status.');
  return data;
};