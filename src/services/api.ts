import axios from 'axios';

// Base URL de la API: utiliza la variable de entorno en producción o el proxy en desarrollo
const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: 'INGRESO' | 'GASTO';
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
  categoriaNombre?: string;
}

export interface PresupuestoDto {
  id?: number;
  montoTotal: number;
  alerta: string;
  gastoActual: number;
  periodo: 'MENSUAL' | 'ANUAL' | 'SEMANAL';
  categoriaId: number;
  categoriaNombre?: string;
}

export interface Transaction {
  id?: number;
  monto: number;
  destinatario: string;
  fecha: string;
  tipo: 'GASTO' | 'INGRESO';
  cuentaId: number;
  categoriaId: number;
}

export interface Item {
  id?: number;
  nombre: string;
  precio: number;
  descripcion: string;
  transaccionId: number;
}

export interface ReportDto {
  fechaGeneracion?: string;
  tipoReporte: 'FINANCIERO' | 'GASTOS' | 'INGRESOS';
  fechaInicio: string;
  fechaFin: string;
  formato: 'JSON' | 'PDF' | 'CSV';
}

export const api = {
  // Auth
  login: async (loginDto: LoginDto): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, loginDto);
    return response.data;
  },

  register: async (user: User): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return response.data;
  },

  // Accounts
  getAccounts: async (token: string) => {
    const response = await axios.get(`${API_URL}/cuentas/miscuentas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteAccount: async (id: number, token: string) => {
    await axios.delete(`${API_URL}/cuentas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createAccount: async (account: CreateAccountDto, token: string) => {
    const response = await axios.post(`${API_URL}/cuentas`, account, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateAccount: async (id: number, account: CreateAccountDto, token: string) => {
    const response = await axios.put(`${API_URL}/cuentas/${id}`, account, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Categories
  getCategories: async (token: string) => {
    const response = await axios.get(`${API_URL}/categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createCategory: async (category: CategoriaDto, token: string) => {
    const response = await axios.post(`${API_URL}/categorias`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateCategory: async (id: number, category: CategoriaDto, token: string) => {
    const response = await axios.put(`${API_URL}/categorias/${id}`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteCategory: async (id: number, token: string) => {
    if (!id) {
      throw new Error('El ID de la categoría es obligatorio para eliminar.');
    }
    await axios.delete(`${API_URL}/categorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Subcategories
  createSubcategory: async (subcategory: SubcategoriaDto, token: string) => {
    const response = await axios.post(`${API_URL}/subcategorias`, subcategory, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getSubcategories: async (token: string): Promise<SubcategoriaDto[]> => {
    const response = await axios.get(`${API_URL}/subcategorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateSubcategory: async (id: number, subcategory: SubcategoriaDto, token: string) => {
    const response = await axios.put(`${API_URL}/subcategorias/${id}`, subcategory, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubcategory: async (id: number, token: string) => {
    await axios.delete(`${API_URL}/subcategorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Budgets
  getBudgets: async (token: string): Promise<PresupuestoDto[]> => {
    const response = await axios.get(`${API_URL}/presupuestos/mispresupuestos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createBudget: async (budget: PresupuestoDto, token: string): Promise<PresupuestoDto> => {
    const response = await axios.post(`${API_URL}/presupuestos`, budget, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateBudget: async (id: number, budget: PresupuestoDto, token: string): Promise<PresupuestoDto> => {
    const response = await axios.put(`${API_URL}/presupuestos/${id}`, budget, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteBudget: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/presupuestos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Transactions
  getTransactions: async (token: string, page: number): Promise<{
    totalItems: number;
    transacciones: Transaction[];
    totalPages: number;
    currentPage: number;
  }> => {
    const response = await axios.get(`${API_URL}/transacciones/mistransacciones?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getTransaction: async (token: string, id: number): Promise<Transaction> => {
    const response = await axios.get(`${API_URL}/transacciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createTransaction: async (transaction: Transaction, token: string): Promise<Transaction> => {
    const response = await axios.post(`${API_URL}/transacciones`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateTransaction: async (id: number, transaction: Transaction, token: string): Promise<Transaction> => {
    const response = await axios.put(`${API_URL}/transacciones/${id}`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteTransaction: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/transacciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Items
  getItems: async (token: string, transaccionId: number): Promise<Item[]> => {
    const response = await axios.get(`${API_URL}/items?transaccionId=${transaccionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createItem: async (item: Item, token: string): Promise<Item> => {
    const response = await axios.post(`${API_URL}/items`, item, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateItem: async (id: number, item: Item, token: string): Promise<Item> => {
    const response = await axios.put(`${API_URL}/items/${id}`, item, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteItem: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Reports
  createReport: async (report: ReportDto, token: string) => {
    const response = await axios.post(`${API_URL}/reportes`, report, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getReports: async (token: string) => {
    const response = await axios.get(`${API_URL}/reportes/misreportes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateReport: async (id: number, report: ReportDto, token: string) => {
    const response = await axios.put(`${API_URL}/reportes/${id}`, report, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
