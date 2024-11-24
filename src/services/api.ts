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
export interface Account {
  id: number;
  nombre: string;
  saldo: number;
  tipoCuenta: string;
  moneda: string;
}
// Definir el DTO para la categoría
export interface CategoriaDto {
  nombre: string;
  descripcion: string;
  tipo: 'Ingreso' | 'Gasto'; // Enum restringido
}
export interface CreateAccountDto {
  nombre: string;
  saldo: number;
  tipoCuenta: string;
  moneda: string;
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
  
  getAccounts: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/cuentas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Eliminar cuenta
  deleteAccount: async (id: number, token: string) => {
    await axios.delete(`${API_URL}/api/cuentas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Obtener transacciones
  getTransactions: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/transacciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createAccount: async (account: CreateAccountDto, token: string) => {
    const response = await axios.post(`${API_URL}/api/cuentas`, account, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  
};