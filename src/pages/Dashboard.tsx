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
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null); // Para la confirmación de eliminación
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
        setAccountToDelete(null); // Cierra la confirmación
      } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
      }
    }
  };

  const handleCancelDelete = () => {
    setAccountToDelete(null); // Cierra la confirmación
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Dashboard</h1>

        <div className="flex justify-center space-x-4 mb-10">
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
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Tus Cuentas</h2>
            <Button
              label="Crear Cuenta"
              onClick={() => setModalOpen(true)}
              type="primary"
              className="px-6 py-3"
            />
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Cargando cuentas...</p>
          ) : accounts.length === 0 ? (
            <p className="text-center text-gray-500">No tienes cuentas registradas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 border rounded-lg shadow-md bg-white"
                >
                  <h3 className="text-xl font-bold text-blue-600">{account.nombre}</h3>
                  <p className="text-gray-700 mt-2">
                    <strong>Saldo:</strong> {account.saldo} {account.moneda}
                  </p>
                  <p className="text-gray-500">
                    <strong>Tipo:</strong> {account.tipoCuenta}
                  </p>
                  <div className="flex justify-between mt-4">
                    <Button
                      label="Editar"
                      onClick={() => navigate(`/edit-account/${account.id}`)}
                      type="primary"
                    />
                    <Button
                      label="Eliminar"
                      onClick={() => setAccountToDelete(account)} // Activa la confirmación
                      type="danger"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
}

export default Dashboard;
