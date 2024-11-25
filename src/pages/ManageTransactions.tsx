import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, CategoriaDto, Account } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

interface Transaction {
  id?: number;
  monto: number;
  destinatario: string;
  fecha: string;
  tipo: "GASTO" | "INGRESO";
  cuentaId: number;
  categoriaId: number;
}

interface PaginatedTransactions {
  totalItems: number;
  transacciones: Transaction[];
  totalPages: number;
  currentPage: number;
}

function ManageTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginatedTransactions>({
    totalItems: 0,
    transacciones: [],
    totalPages: 0,
    currentPage: 0,
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions(0);
    fetchAccountsAndCategories();
  }, [token]);

  async function fetchTransactions(page: number) {
    try {
      const data = await api.getTransactions(token || "", page);
      setPagination(data);
      setTransactions(data.transacciones);
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
    }
  }

  async function fetchAccountsAndCategories() {
    try {
      const [accountsData, categoriesData] = await Promise.all([
        api.getAccounts(token || ""),
        api.getCategories(token || ""),
      ]);
      setAccounts(accountsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error al cargar cuentas y categorías:", error);
    }
  }

  const openModal = (transaction?: Transaction) => {
    setCurrentTransaction(
      transaction || {
        monto: 0,
        destinatario: "",
        fecha: new Date().toISOString().split("T")[0],
        tipo: "GASTO",
        cuentaId: 0,
        categoriaId: 0,
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTransaction(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTransaction((prev) =>
      prev ? { ...prev, [name]: name === "monto" ? parseFloat(value) : value } : null
    );
  };

  const handleSave = async () => {
    if (!currentTransaction) return;
    try {
      if (currentTransaction.id) {
        await api.updateTransaction(currentTransaction.id, currentTransaction, token || "");
        alert("Transacción actualizada.");
      } else {
        await api.createTransaction(currentTransaction, token || "");
        alert("Transacción creada.");
      }
      closeModal();
      fetchTransactions(pagination.currentPage);
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
      alert("No se pudo guardar la transacción.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTransaction(id, token || "");
      alert("Transacción eliminada.");
      fetchTransactions(pagination.currentPage);
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
      alert("No se pudo eliminar la transacción.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center bg-blue-100 py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Gestión de Transacciones</h1>
        <div className="flex space-x-4">
          <Button label="Nueva Transacción" onClick={() => openModal()} type="primary" />
          <Button label="Volver al Dashboard" onClick={() => navigate("/dashboard")} type="secondary" />
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">{transaction.destinatario}</h3>
            <p className="text-gray-700">Monto: {transaction.monto}</p>
            <p className="text-gray-500">Fecha: {transaction.fecha}</p>
            <p className="text-gray-500">Tipo: {transaction.tipo}</p>
            <div className="flex justify-between mt-4">
              <Button label="Editar" onClick={() => openModal(transaction)} type="primary" />
              <Button label="Eliminar" onClick={() => handleDelete(transaction.id!)} type="danger" />
              <Button
                label="Items"
                onClick={() => navigate(`/manage-items/${transaction.id}`)}
                type="secondary"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button
          label="Anterior"
          onClick={() => fetchTransactions(pagination.currentPage - 1)}
          type="secondary"
          disabled={pagination.currentPage === 0}
        />
        <Button
          label="Siguiente"
          onClick={() => fetchTransactions(pagination.currentPage + 1)}
          type="secondary"
          disabled={pagination.currentPage + 1 >= pagination.totalPages}
        />
      </div>

      {/* Modal para crear/editar transacción */}
      {isModalOpen && currentTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {currentTransaction.id ? "Editar Transacción" : "Nueva Transacción"}
            </h2>
            <input
              name="destinatario"
              value={currentTransaction.destinatario}
              onChange={handleInputChange}
              placeholder="Destinatario"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              name="monto"
              type="number"
              value={currentTransaction.monto}
              onChange={handleInputChange}
              placeholder="Monto"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              name="fecha"
              type="date"
              value={currentTransaction.fecha}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <select
              name="tipo"
              value={currentTransaction.tipo}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="GASTO">Gasto</option>
              <option value="INGRESO">Ingreso</option>
            </select>
            <select
              name="cuentaId"
              value={currentTransaction.cuentaId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="0" disabled>
                Selecciona una cuenta
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.nombre}
                </option>
              ))}
            </select>
            <select
              name="categoriaId"
              value={currentTransaction.categoriaId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="0" disabled>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button label="Guardar" onClick={handleSave} type="primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTransactions;
