import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, CreateAccountDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Select from "../components/Select";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header title="Editar Cuenta" />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <div className="space-y-4">
            <InputField
              name="nombre"
              placeholder="Nombre"
              value={account.nombre}
              onChange={handleInputChange}
            />
            <InputField
              name="saldo"
              type="number"
              placeholder="Saldo"
              value={account.saldo}
              onChange={handleInputChange}
            />
            <Select
              name="tipoCuenta"
              value={account.tipoCuenta}
              onChange={handleInputChange}
              options={[
                { value: "AHORRO", label: "Ahorro" },
                { value: "CORRIENTE", label: "Corriente" },
                { value: "INVERSION", label: "Inversión" },
              ]}
            />
            <Select
              name="moneda"
              value={account.moneda}
              onChange={handleInputChange}
              options={[
                { value: "USD", label: "USD" },
                { value: "PEN", label: "PEN" },
                { value: "EUR", label: "EUR" },
              ]}
            />
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
      <Footer />
    </div>
  );
}

export default EditAccount;
