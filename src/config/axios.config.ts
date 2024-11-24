import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; // Ajusta la URL según tu entorno

// Instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Cambia esto si decides usar cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en interceptor de petición:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en respuesta:", error.response?.data || error.message);
    // Opcional: Maneja errores globales (como desloguear si el token expiró)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirige al login si no autenticado
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
