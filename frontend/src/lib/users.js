// Se o .env falhar, ele usa a porta 3000 que vimos que está ativa
const API_URL = import.meta.env.VITE_FASTAPI_URL || "http://localhost:3000";

export const handleApiResponse = async (response) => {
  if (response.status === 403) {
    // Redireciona para o Unauthorized.jsx
    window.location.href = '/unauthorized';
    return null; // Interrompe o fluxo
  }
  
  if (!response.ok) {
    console.error(`Erro na API: ${response.status}`);
    return null;
  }
  
  return await response.json();
};

/**
 * Procurar todos os utilizadores
 */
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

    // 1. Verifica especificamente o 403 primeiro
    if (response.status === 403) {
      console.log("Acesso negado. Redirecionando...");
      window.location.href = '/unauthorized';
      return []; // Retorna vazio enquanto redireciona
    }

    // 2. Verifica outros erros
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

/**
 * Atualizar permissões/estado do utilizador
 */
export const updateUserPermissions = async (userId, ativo, novasPermissoes) => {
  const token = localStorage.getItem("token");

  try {
    // 🔴 CORREÇÃO DO URL: Alinhado com a rota base do teu backend para um utilizador específico
    // (Nota: Ajustei para o padrão REST /api/users/:id, que costuma ser o normal no Node)
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