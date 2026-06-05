const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

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

export const getResourceReservations = async (resourceId) => {
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/reservations`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resource reservations.');
  return data;
};

export const getResourceAccesses = async (resourceId) => {
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/accesses`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resource accesses.');
  return data;
};

export const getResources = async () => {
  const response = await fetch(`${API_URL}/api/resources`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources.');
  return data;
};

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

export const getResourcesByType = async (type) => {
  const response = await fetch(`${API_URL}/api/resources/type/${type}`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources by type.');
  return data;
};

export const getAllReservations = async () => {
  const response = await fetch(`${API_URL}/api/resources/reservations/all`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch all reservations.');
  return data;
};

export const getAllAccesses = async () => {
  const response = await fetch(`${API_URL}/api/resources/accesses/all`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch all accesses.');
  return data;
};

export const updateResource = async (id, formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update resource.');
  return data;
};

export const deleteResource = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete resource.');
  return data;
};