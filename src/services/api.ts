import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

// Definir el DTO para la categoría
export interface CategoriaDto {
  nombre: string;
  descripcion: string;
  tipo: 'Ingreso' | 'Gasto'; // Enum restringido
}

export const api = {
  login: async (loginDto: LoginDto): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, loginDto);
    return response.data;
  },

  register: async (user: User): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return response.data;
  },

  // Método para crear categorías
  crearCategoria: async (categoria: CategoriaDto, token: string): Promise<void> => {
    await axios.post(`${API_URL}/api/categorias`, categoria, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token de autorización
      },
    });
  },
};
