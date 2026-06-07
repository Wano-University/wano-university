const API_URL = import.meta.env.VITE_FASTAPI_URL || "http://localhost:3000";

export const handleApiResponse = async (response) => {
  if (!response.ok) {
    console.error(`Erro na API: ${response.status}`);
    return null;
  }
  
  return await response.json();
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro na resposta da API: Status ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao conectar ao servidor:", error);
    return [];
  }
};


export const updateUserPermissions = async (userId, ativo, novasPermissoes) => {
  const token = localStorage.getItem("token");

  try {
const response = await fetch(`${API_URL}/api/admin/users/${userId}/permissions`, {
  method: "PUT",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ ativo, novasPermissoes }),
});

    if (!response.ok) return { success: false };
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar utilizador:", error);
    return { success: false };
  }
};

export const updateUserData = async (userId, data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/admin/users/${userId}/profile`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error("Erro ao atualizar dados");
  return await response.json();
};