const API_URL = import.meta.env.VITE_API_URL;

export const getActiveMenu = async () => {

  const response = await fetch(`${API_URL}/api/menu/getMenu`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || 'Error loading the menu.');
  return data; 
};

export const updateActiveMenu = async (dishIds) => {

  const response = await fetch(`${API_URL}/api/menu/updateMenu`, {
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dishIds }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update the active dishes.');
  return data; 
};