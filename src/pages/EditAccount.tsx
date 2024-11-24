import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, CreateAccountDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

function EditAccount() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<CreateAccountDto>({
    nombre: "",
    saldo: 0,
    tipoCuenta: "AHORRO",
    moneda: "USD",
  });
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAccount() {
      try {
        const data = await api.getAccounts(token || "");
        const currentAccount = data.find((acc: any) => acc.id === parseInt(id || "0"));
        if (currentAccount) {
          setAccount(currentAccount);
        }
      } catch (error) {
        console.error("Error al cargar la cuenta:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAccount();
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: name === "saldo" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.updateAccount(parseInt(id || "0"), account, token || "");
      alert("Cuenta actualizada exitosamente");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al actualizar la cuenta:", error);
      alert("No se pudo actualizar la cuenta. Intenta nuevamente.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Editar Cuenta</h1>
        <div className="space-y-4">
          <input
            name="nombre"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nombre"
            value={account.nombre}
            onChange={handleInputChange}
          />
          <input
            name="saldo"
            type="number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Saldo"
            value={account.saldo}
            onChange={handleInputChange}
          />
          <select
            name="tipoCuenta"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={account.tipoCuenta}
            onChange={handleInputChange}
          >
            <option value="AHORRO">Ahorro</option>
            <option value="CORRIENTE">Corriente</option>
            <option value="INVERSION">Inversión</option>
          </select>
          <select
            name="moneda"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={account.moneda}
            onChange={handleInputChange}
          >
            <option value="USD">USD</option>
            <option value="PEN">PEN</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            label="Cancelar"
            onClick={() => navigate("/dashboard")}
            type="secondary"
            className="w-1/3"
          />
          <Button
            label="Guardar"
            onClick={handleSave}
            type="primary"
            className="w-1/3"
          />
        </div>
      </div>
    </div>
  );
}

export default EditAccount;
