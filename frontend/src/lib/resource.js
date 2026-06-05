const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to get token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// 1. Register Resource
export const registerResource = async (resourceData) => {
  const response = await fetch(`${API_URL}/api/resources`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(resourceData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to register resource.');
  return data;
};

// 2. Get Resources By Floor
export const getResourcesByFloor = async (floorEnum) => {
  const response = await fetch(
    `${API_URL}/api/resources/floor/${floorEnum}`,
    { headers: getHeaders() }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("BACKEND RESPONSE:", data);

    throw new Error(
      data.details ||
      data.error ||
      'Failed to fetch resources by floor.'
    );
  }

  return data;
};

// 3. Get Reservations by Resource ID
export const getResourceReservations = async (resourceId) => {
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/reservations`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resource reservations.');
  return data;
};

// 4. Get Accesses by Resource ID
export const getResourceAccesses = async (resourceId) => {
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/accesses`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resource accesses.');
  return data;
};

// 5. Get All Resources
export const getResources = async () => {
  const response = await fetch(`${API_URL}/api/resources`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources.');
  return data;
};

// 6. Update Resource Status
export const updateResourceStatus = async (resourceId, isAvailable) => {
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/status`, {
    method: 'PATCH', // or PUT depending on your route setup
    headers: getHeaders(),
    body: JSON.stringify({ isAvailable }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update resource status.');
  return data;
};

// 7. Get Resources By Type
export const getResourcesByType = async (type) => {
  const response = await fetch(`${API_URL}/api/resources/type/${type}`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources by type.');
  return data;
};

// 8. Get All Reservations Data
export const getAllReservations = async () => {
  const response = await fetch(`${API_URL}/api/resources/reservations/all`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch all reservations.');
  return data;
};

// 9. Get All Accesses Data
export const getAllAccesses = async () => {
  const response = await fetch(`${API_URL}/api/resources/accesses/all`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch all accesses.');
  return data;
};