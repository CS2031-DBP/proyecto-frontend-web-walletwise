import axios from 'axios';

const API_URL = '/api';

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
export interface CategoriaDto {
  nombre: string;
  descripcion: string;
  tipo: "INGRESO" | "GASTO"; // Enum restringido
}

export interface CreateAccountDto {
  nombre: string;
  saldo: number;
  tipoCuenta: string;
  moneda: string;
}

export interface SubcategoriaDto {
  id?: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre?: string; // Nuevo campo
}

export interface PresupuestoDto {
  id?: number;
  montoTotal: number;
  alerta: string;
  gastoActual: number;
  periodo: "MENSUAL" | "ANUAL" | "SEMANAL";
  categoriaId: number;
  categoriaNombre?: string; // Opcional para mostrar el nombre de la categoría
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


getAccounts: async (token: string) => {
  console.log("Usando token para getAccounts:", token);
  const response = await axios.get(`${API_URL}/api/cuentas/miscuentas`, {
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
  updateAccount: async (id: number, account: CreateAccountDto, token: string) => {
    const response = await axios.put(`${API_URL}/api/cuentas/${id}`, account, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /////
  getCategories: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createCategory: async (category: CategoriaDto, token: string) => {
    const response = await axios.post(`${API_URL}/api/categorias`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateCategory: async (id: number, category: CategoriaDto, token: string) => {
    const response = await axios.put(`${API_URL}/api/categorias/${id}`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteCategory: async (id: number, token: string) => {
    await axios.delete(`${API_URL}/api/categorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  ///////

  // Crear subcategoría
  createSubcategory: async (subcategory: SubcategoriaDto, token: string) => {
    const response = await axios.post(`${API_URL}/api/subcategorias`, subcategory, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener todas las subcategorías
  getSubcategories: async (token: string): Promise<SubcategoriaDto[]> => {
    const response = await axios.get(`${API_URL}/api/subcategorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Actualizar subcategoría
  updateSubcategory: async (
    id: number,
    subcategory: SubcategoriaDto,
    token: string
  ) => {
    const response = await axios.put(`${API_URL}/api/subcategorias/${id}`, subcategory, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Eliminar subcategoría
  deleteSubcategory: async (id: number, token: string) => {
    await axios.delete(`${API_URL}/api/subcategorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getBudgets: async (token: string): Promise<PresupuestoDto[]> => {
    const response = await axios.get(`${API_URL}/api/presupuestos/mispresupuestos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createBudget: async (budget: PresupuestoDto, token: string): Promise<PresupuestoDto> => {
    const response = await axios.post(`${API_URL}/api/presupuestos`, budget, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateBudget: async (id: number, budget: PresupuestoDto, token: string): Promise<PresupuestoDto> => {
    const response = await axios.put(`${API_URL}/api/presupuestos/${id}`, budget, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteBudget: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/presupuestos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

};