const API_URL = import.meta.env.VITE_API_URL;

export const getAllDishes = async () => {
  const response = await fetch(`${API_URL}/api/dishes`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load catalog.');
  return data;
};

export const createDish = async (formData) => {
  const response = await fetch(`${API_URL}/api/dishes`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.error || 'Failed to create dish.');

  return data;
};

export const setDish = async (id, isActive) => {

  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'PATCH', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to set as active.');
  return data;
};

export const getDishesByType = async (type) => {
  const response = await fetch(`${API_URL}/api/dishes/type/${type}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to load ${type} (${response.status})`);
  }
  
  return response.json();
};

export const updateDishAPI = async (id, formData) => {
  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'PUT',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update dish.');
  return data;
};

export const deleteDishAPI = async (id) => {
  const response = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete dish.');
  return data;
};