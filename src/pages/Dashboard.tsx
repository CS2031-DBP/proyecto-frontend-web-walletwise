import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Select from "../components/Select";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

interface Account {
  id: number;
  nombre: string;
  saldo: number;
  tipoCuenta: string;
  moneda: string;
}

function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState({
    nombre: "",
    saldo: 0,
    tipoCuenta: "AHORRO",
    moneda: "USD",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchAccounts() {
      try {
        const data = await api.getAccounts(token);
        setAccounts(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert("Sesión expirada. Por favor inicia sesión de nuevo.");
          navigate("/login");
        } else {
          console.error("Error al obtener las cuentas:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [token, navigate]);

  const handleCreateAccount = async () => {
    try {
      await api.createAccount(
        {
          nombre: newAccount.nombre,
          saldo: parseFloat(newAccount.saldo.toString()),
          tipoCuenta: newAccount.tipoCuenta,
          moneda: newAccount.moneda,
        },
        token || ""
      );

      setModalOpen(false);
      setNewAccount({ nombre: "", saldo: 0, tipoCuenta: "AHORRO", moneda: "USD" });
      const updatedAccounts = await api.getAccounts(token || "");
      setAccounts(updatedAccounts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al crear cuenta:", error.message);
        alert("Hubo un error al crear la cuenta. Intenta de nuevo.");
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (accountToDelete) {
      try {
        await api.deleteAccount(accountToDelete.id, token || "");
        setAccounts((prev) => prev.filter((account) => account.id !== accountToDelete.id));
        alert("Cuenta eliminada exitosamente.");
        setAccountToDelete(null);
      } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
      }
    }
  };

  const handleCancelDelete = () => {
    setAccountToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Encabezado */}
      <Header title="Tu Dashboard" />

      {/* Botones de navegación */}
      <section className="py-8 w-full flex flex-col items-center space-y-4">
        <div className="flex flex-wrap justify-center space-x-4">
          <Button
            label="Gestionar Subcategorías"
            onClick={() => navigate("/subcategories")}
            type="secondary"
          />
          <Button
            label="Gestionar Categorías"
            onClick={() => navigate("/categories")}
            type="secondary"
          />
          <Button
            label="Gestionar Transacciones"
            onClick={() => navigate("/manage-transactions")}
            type="secondary"
          />
          <Button
            label="Gestionar Presupuestos"
            onClick={() => navigate("/budgets")}
            type="primary"
          />
        </div>
        <div className="flex flex-wrap justify-center space-x-4">
          <Button
            label="Gestionar Reportes"
            onClick={() => navigate("/manage-reports")}
            type="primary"
          />
          <Button
            label="Crear Cuenta"
            onClick={() => setModalOpen(true)}
            type="primary"
          />
          <Button
            label="Ver Perfil"
            onClick={() => navigate("/profile")}
            type="secondary"
          />
        </div>
      </section>

      {/* Cuentas */}
      <section className="max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-left">Tus Cuentas</h2>
        {loading ? (
          <LoadingSpinner />
        ) : accounts.length === 0 ? (
          <p className="text-gray-500">No tienes cuentas registradas.</p>
        ) : (
          <div className="space-y-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[150px]"
              >
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-blue-600">{account.nombre}</h3>
                  <p className="text-gray-700 mt-2">
                    <strong>Saldo:</strong> {account.saldo} {account.moneda}
                  </p>
                  <p className="text-gray-500">
                    <strong>Tipo:</strong> {account.tipoCuenta}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    label="Editar"
                    onClick={() => navigate(`/edit-account/${account.id}`)}
                    type="primary"
                  />
                  <Button
                    label="Eliminar"
                    onClick={() => setAccountToDelete(account)}
                    type="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modales */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Crear Nueva Cuenta">
        <InputField
          name="nombre"
          placeholder="Nombre de la cuenta"
          value={newAccount.nombre}
          onChange={(e) => setNewAccount((prev) => ({ ...prev, nombre: e.target.value }))}
        />
        <InputField
          name="saldo"
          type="number"
          placeholder="Saldo inicial"
          value={newAccount.saldo}
          onChange={(e) =>
            setNewAccount((prev) => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))
          }
        />
        <Select
          name="tipoCuenta"
          value={newAccount.tipoCuenta}
          onChange={(e) => setNewAccount((prev) => ({ ...prev, tipoCuenta: e.target.value }))}
          options={[
            { value: "AHORRO", label: "Ahorro" },
            { value: "CORRIENTE", label: "Corriente" },
            { value: "INVERSION", label: "Inversión" },
          ]}
        />
        <Select
          name="moneda"
          value={newAccount.moneda}
          onChange={(e) => setNewAccount((prev) => ({ ...prev, moneda: e.target.value }))}
          options={[
            { value: "USD", label: "USD" },
            { value: "PEN", label: "PEN" },
            { value: "EUR", label: "EUR" },
          ]}
        />
        <div className="flex justify-between">
          <Button label="Cancelar" onClick={() => setModalOpen(false)} type="secondary" />
          <Button label="Crear" onClick={handleCreateAccount} type="primary" />
        </div>
      </Modal>

      {accountToDelete && (
        <Modal isOpen={!!accountToDelete} onClose={handleCancelDelete}>
          <h2 className="text-lg font-bold text-center mb-4">
            ¿Estás seguro de que deseas eliminar esta cuenta?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {accountToDelete.nombre} - {accountToDelete.saldo} {accountToDelete.moneda}
          </p>
          <div className="flex justify-around">
            <Button label="No" onClick={handleCancelDelete} type="secondary" />
            <Button label="Sí, Eliminar" onClick={handleConfirmDelete} type="danger" />
          </div>
        </Modal>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Dashboard;

