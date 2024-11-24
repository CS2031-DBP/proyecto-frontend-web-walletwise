import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

interface Account {
  id: number;
  nombre: string;
  saldo: number;
  tipoCuenta: string;
}

function ManageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const data = await api.getAccounts(token || "");
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [token]);

  const handleDeleteAccount = async (id: number) => {
    try {
      await api.deleteAccount(id, token || "");
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Cuentas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 border rounded shadow-md bg-white"
            >
              <h3 className="text-lg font-bold">{account.nombre}</h3>
              <p className="text-gray-600">Saldo: {account.saldo} USD</p>
              <p className="text-gray-500">Tipo: {account.tipoCuenta}</p>
              <Button
                label="Eliminar"
                onClick={() => handleDeleteAccount(account.id)}
                type="danger"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageAccounts;