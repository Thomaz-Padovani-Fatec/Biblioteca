import axios from "axios";

// Nas aulas usamos api.get(...) sem mostrar de onde o "api" vem. É daqui.
// axios.create faz uma cópia configurada do axios. O baseURL é o prefixo de
// todos os endereços, então api.get("/livros") vira http://127.0.0.1:8000/api/v1/livros.
// O valor vem do arquivo .env (VITE_API_URL), e por isso mudar o .env exige
// reiniciar o npm run dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Um interceptor é uma função que roda automaticamente ANTES de toda
// requisição feita com essa instância "api", então o token já vai anexado
// sozinho, sem precisar repetir isso em cada chamada.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
