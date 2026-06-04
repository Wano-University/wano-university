const API_URL = import.meta.env.VITE_API_URL;

export const registerResource = async (resourceData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(resourceData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Failed to register resource.');
  return data;
};

export const getAllResources = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources.');
  return data;
};

export const getResourcesByFloor = async (floor) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/floor/${floor}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources by floor.');
  return data;
};

export const getResourcesByType = async (type) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/type/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch resources by type.');
  return data;
};

export const updateResourceStatus = async (id, isAvailable) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isAvailable }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update resource availability.');
  return data;
};

export const getResourceReservations = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${id}/reservations`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load reservations for this resource.');
  return data;
};

export const getResourceAccesses = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${id}/accesses`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load accesses for this resource.');
  return data;
};

export const getAllResourcesReservations = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/data/reservations`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load all reservations data.');
  return data;
};

export const getAllResourcesAccesses = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/data/accesses`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load all accesses data.');
  return data;
};