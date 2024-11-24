import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
      {/* Encabezado */}
      <header className="w-full bg-blue-600 text-white py-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Tu Dashboard</h1>
          <p className="mt-4 text-lg">Gestiona tus cuentas y categorías</p>
        </div>
      </header>

      {/* Botones de navegación */}
      <section className="py-8 w-full flex justify-center space-x-6">
        <Button
          label="Gestionar Transacciones"
          onClick={() => navigate("/manage-transactions")}
          type="secondary"
          className="px-6 py-3"
        />
        <Button
          label="Gestionar Categorías"
          onClick={() => navigate("/categories")}
          type="secondary"
          className="px-6 py-3"
        />
        <Button
          label="Crear Cuenta"
          onClick={() => setModalOpen(true)}
          type="primary"
          className="px-6 py-3"
        />
      </section>

      {/* Cuentas */}
      <section className="flex items-start max-w-6xl mx-auto p-4">
  {/* Lista de cuentas */}
  <div className="w-2/3">
    <h2 className="text-3xl font-bold text-blue-700 mb-6">Tus Cuentas</h2>
    {loading ? (
      <p className="text-gray-500">Cargando cuentas...</p>
    ) : accounts.length === 0 ? (
      <p className="text-gray-500">No tienes cuentas registradas.</p>
    ) : (
      <div className="space-y-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-6 border rounded-lg shadow-lg bg-white flex justify-between items-center"
          >
            <div>
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
  </div>

  {/* Imagen de billetera */}
  <div className="w-1/3 flex justify-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
      alt="Wallet"
      className="w-2/3"
    />
  </div>
</section>


      {/* Modal para crear cuenta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Cuenta</h2>
            <input
              type="text"
              placeholder="Nombre de la cuenta"
              value={newAccount.nombre}
              onChange={(e) =>
                setNewAccount((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="number"
              placeholder="Saldo inicial"
              value={newAccount.saldo}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  saldo: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full p-2 border rounded mb-4"
            />
            <select
              value={newAccount.tipoCuenta}
              onChange={(e) =>
                setNewAccount((prev) => ({ ...prev, tipoCuenta: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="AHORRO">Ahorro</option>
              <option value="CORRIENTE">Corriente</option>
              <option value="INVERSION">Inversión</option>
            </select>
            <select
              value={newAccount.moneda}
              onChange={(e) =>
                setNewAccount((prev) => ({ ...prev, moneda: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="USD">USD</option>
              <option value="PEN">PEN</option>
              <option value="EUR">EUR</option>
            </select>
            <div className="flex justify-between">
              <Button
                label="Cancelar"
                onClick={() => setModalOpen(false)}
                type="secondary"
              />
              <Button
                label="Crear"
                onClick={handleCreateAccount}
                type="primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {accountToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-center text-gray-800 mb-4">
              ¿Estás seguro de que deseas eliminar esta cuenta?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {accountToDelete.nombre} - {accountToDelete.saldo} {accountToDelete.moneda}
            </p>
            <div className="flex justify-around">
              <Button label="No" onClick={handleCancelDelete} type="secondary" />
              <Button label="Sí, Eliminar" onClick={handleConfirmDelete} type="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
