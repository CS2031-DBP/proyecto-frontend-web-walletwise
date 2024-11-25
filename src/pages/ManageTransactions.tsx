import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, CategoriaDto, Account } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Select from "../components/Select";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <div className="min-h-screen flex flex-col">
  <Header title="Gestión de Transacciones" />
  <div className="flex-grow max-w-7xl mx-auto p-6">
    {/* Botones de acción centrados */}
    <div className="flex justify-center space-x-4 mb-6">
      <Button
        label="Nueva Transacción"
        onClick={() => openModal()}
        type="primary"
      />
      <Button
        label="Volver al Dashboard"
        onClick={() => navigate("/dashboard")}
        type="secondary"
      />
    </div>

    {/* Lista de transacciones */}
    {transactions.length === 0 ? (
      <p className="text-gray-500">No hay transacciones registradas.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[180px] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-blue-600">
                {transaction.destinatario}
              </h3>
              <p className="text-gray-700 mt-2">
                <strong>Monto:</strong> {transaction.monto}
              </p>
              <p className="text-gray-500">
                <strong>Fecha:</strong> {transaction.fecha}
              </p>
              <p className="text-gray-500">
                <strong>Tipo:</strong> {transaction.tipo}
              </p>
            </div>
            <div className="flex justify-between mt-4 space-x-2">
              <Button
                label="Editar"
                onClick={() => openModal(transaction)}
                type="primary"
              />
              <Button
                label="Eliminar"
                onClick={() => handleDelete(transaction.id!)}
                type="danger"
              />
              <Button
                label="Items"
                onClick={() => navigate(`/manage-items/${transaction.id}`)}
                type="secondary"
              />
            </div>
          </div>
        ))}
      </div>
    )}

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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          currentTransaction.id ? "Editar Transacción" : "Nueva Transacción"
        }
      >
        <InputField
          name="destinatario"
          value={currentTransaction.destinatario}
          onChange={handleInputChange}
          placeholder="Destinatario"
        />
        <InputField
          name="monto"
          type="number"
          value={currentTransaction.monto}
          onChange={handleInputChange}
          placeholder="Monto"
        />
        <InputField
          name="fecha"
          type="date"
          value={currentTransaction.fecha}
          onChange={handleInputChange}
        />
        <Select
          name="tipo"
          value={currentTransaction.tipo}
          onChange={handleInputChange}
          options={[
            { value: "GASTO", label: "Gasto" },
            { value: "INGRESO", label: "Ingreso" },
          ]}
        />
        <Select
          name="cuentaId"
          value={currentTransaction.cuentaId}
          onChange={handleInputChange}
          options={[
            { value: "0", label: "Selecciona una cuenta" },
            ...accounts.map((account) => ({
              value: account.id,
              label: account.nombre,
            })),
          ]}
        />
        <Select
          name="categoriaId"
          value={currentTransaction.categoriaId}
          onChange={handleInputChange}
          options={[
            { value: "0", label: "Selecciona una categoría" },
            ...categories.map((category) => ({
              value: category.id!,
              label: category.nombre,
            })),
          ]}
        />
        <div className="flex justify-between mt-4">
          <Button label="Cancelar" onClick={closeModal} type="secondary" />
          <Button label="Guardar" onClick={handleSave} type="primary" />
        </div>
      </Modal>
    )}
  </div>
  <Footer />
</div>

  );
}

export default ManageTransactions;
