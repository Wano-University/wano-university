const API_URL = import.meta.env.VITE_API_URL;

export const getAllDishes = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load catalog.');
  return data;
};

export const createDish = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },

    body: formData,
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.error || 'Failed to create dish.');

  return data;
};

export const setDish = async (id, isActive) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to set as active.');
  return data;
};

export const getDishesByType = async (type) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes/type/${type}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to load ${type} (${response.status})`);
  }

  return response.json();
};

export const updateDishAPI = async (id, formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update dish.');
  return data;
};

export const deleteDishAPI = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete dish.');
  return data;
};
