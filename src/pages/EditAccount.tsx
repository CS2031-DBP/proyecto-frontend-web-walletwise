import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, CreateAccountDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

function EditAccount() {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la cuenta desde la URL
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
    // Obtener la información de la cuenta para rellenar el formulario
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
      [name]: name === "saldo" ? parseFloat(value) : value, // Asegúrate de convertir saldo a número
    }));
  };

  const handleSave = async () => {
    try {
      await api.updateAccount(parseInt(id || "0"), account, token || "");
      alert("Cuenta actualizada exitosamente");
      navigate("/dashboard"); // Regresa al dashboard después de guardar
    } catch (error) {
      console.error("Error al actualizar la cuenta:", error);
      alert("No se pudo actualizar la cuenta. Intenta nuevamente.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Editar Cuenta</h1>
      <input
        name="nombre"
        className="outline rounded p-2 w-full"
        placeholder="Nombre"
        value={account.nombre}
        onChange={handleInputChange}
      />
      <input
        name="saldo"
        type="number"
        className="outline rounded p-2 w-full"
        placeholder="Saldo"
        value={account.saldo}
        onChange={handleInputChange}
      />
      <select
        name="tipoCuenta"
        className="outline rounded p-2 w-full"
        value={account.tipoCuenta}
        onChange={handleInputChange}
      >
        <option value="AHORRO">Ahorro</option>
        <option value="CORRIENTE">Corriente</option>
        <option value="INVERSION">Inversión</option>
      </select>
      <select
        name="moneda"
        className="outline rounded p-2 w-full"
        value={account.moneda}
        onChange={handleInputChange}
      >
        <option value="USD">USD</option>
        <option value="PEN">PEN</option>
        <option value="EUR">EUR</option>
      </select>
      <div className="flex justify-between">
        <Button label="Cancelar" onClick={() => navigate("/dashboard")} type="secondary" />
        <Button label="Guardar" onClick={handleSave} type="primary" />
      </div>
    </div>
  );
}

export default EditAccount;
