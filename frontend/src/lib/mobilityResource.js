const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const registerMobilityResource = async (mobilityData) => {
  const response = await fetch(`${API_URL}/api/mobilityResources`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(mobilityData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register mobility resource.');
  return data;
};

export const getAllMobilityResources = async () => {
  const response = await fetch(`${API_URL}/api/mobilityResources`, { headers: authHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch mobility resources.');
  return data;
};

export const getMobilityResourcesByType = async (type) => {
  const response = await fetch(`${API_URL}/api/mobilityResources/type/${type}`, { headers: authHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch mobility resources by type.');
  return data;
};

export const updateMobilityStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/api/mobilityResources/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update mobility resource status.');
  return data;
};

export const deleteMobilityResource = async (id) => {
  const response = await fetch(`${API_URL}/api/mobilityResources/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete mobility resource.');
  }
  return true;
};