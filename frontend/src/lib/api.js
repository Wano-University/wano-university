import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:3000', // Certifica-te que aponta para a porta do teu backend
});

// Interceptor de Resposta: Redireciona automaticamente para 403 Forbidden
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Redireciona para a tua página Unauthorized.jsx
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export default api;