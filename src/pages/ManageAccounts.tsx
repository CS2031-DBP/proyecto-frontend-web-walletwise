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
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const { token } = useToken();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const data = await api.getAccounts(token || "");
        console.log("Cuentas cargadas:", data); // Verificar datos recibidos
        setAccounts(data);
      } catch (error) {
        console.error("Error al obtener las cuentas:", error);
        alert("No se pudieron cargar las cuentas. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [token]);

  const handleDeleteAccount = async () => {
    if (!accountToDelete || !accountToDelete.id) {
      alert("No se pudo encontrar la cuenta para eliminar.");
      return;
    }

    try {
      await api.deleteAccount(accountToDelete.id, token || "");
      setAccounts((prev) => prev.filter((account) => account.id !== accountToDelete.id));
      alert("Cuenta eliminada exitosamente.");
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("No se pudo eliminar la cuenta. Intenta nuevamente.");
    }
  };

  const handleCancelDelete = () => {
    setAccountToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Gestión de Cuentas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando cuentas...</p>
      ) : accounts.length === 0 ? (
        <p className="text-gray-500">No tienes cuentas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 border rounded shadow-md bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-600">{account.nombre}</h3>
                <p className="text-gray-700">Saldo: {account.saldo}</p>
                <p className="text-gray-500">Tipo: {account.tipoCuenta}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
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

      {/* Modal para confirmar eliminación */}
      {accountToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-center mb-4">¿Eliminar Cuenta?</h2>
            <p className="text-center text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar la cuenta{" "}
              <span className="font-semibold">{accountToDelete.nombre}</span> con saldo de{" "}
              <span className="font-semibold">{accountToDelete.saldo}</span>?
            </p>
            <div className="flex justify-around">
              <Button label="Cancelar" onClick={handleCancelDelete} type="secondary" />
              <Button label="Eliminar" onClick={handleDeleteAccount} type="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAccounts;
