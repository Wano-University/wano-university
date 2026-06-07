const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getActiveMenu = async () => {
  // A CORREÇÃO ESTÁ AQUI: garantir que tem o /api/menu/getMenu
  const response = await fetch(`${API_URL}/api/menu/getMenu`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Se precisares de token, adiciona aqui:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active menu');
  }

  return response.json();
};

export const updateActiveMenu = async (dishIds, schedule) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/menu/updateMenu`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ dishIds, schedule }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update the active dishes.');
  return data;
};

export const getTodaysMeal = async () => {
  try {
    const data = await getActiveMenu();
    if (!data || !data.schedule || !data.dishes) return null;

    const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

    const todaysIds = data.schedule[todayName];
    if (!todaysIds || !todaysIds.mealId) return null;

    const todayDish = data.dishes.find(d => d.id === todaysIds.mealId);

    return todayDish || null;
  } catch (error) {
    console.error("Failed to fetch today's meal:", error);
    return null;
  }
};
