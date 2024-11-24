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
      // Envía el payload requerido por el backend
      await api.createAccount(
        {
          nombre: newAccount.nombre,
          saldo: parseFloat(newAccount.saldo.toString()),
          tipoCuenta: newAccount.tipoCuenta,
          moneda: newAccount.moneda,
        },
        token || ""
      );
  
      // Cierra el modal y actualiza la lista de cuentas
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      {loading ? (
        <p className="text-center text-gray-500">Cargando cuentas...</p>
      ) : (
        <>
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">Tus Cuentas</h2>
              <Button
                label="Crear Cuenta"
                onClick={() => setModalOpen(true)}
                type="primary"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              ))}
            </div>
          </section>
          <div className="text-center">
            <Button
              label="Gestionar Transacciones"
              onClick={() => navigate("/manage-transactions")}
              type="secondary"
              className="w-48 mx-auto"
            />
          </div>
        </>
      )}
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
        <Button label="Cancelar" onClick={() => setModalOpen(false)} type="secondary" />
        <Button label="Crear" onClick={handleCreateAccount} type="primary" />
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;
