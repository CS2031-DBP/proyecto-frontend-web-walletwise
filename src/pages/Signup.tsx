import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { api } from "../services/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      return "Todos los campos son obligatorios.";
    }
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Introduce un correo electrónico válido.";
    }
    return "";
  };

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      const res = await api.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "USER",
      });
      setToken({ token: res.token, role: res.role });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrarse:", error);
      setErrorMessage("No se pudo completar el registro. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Crear Cuenta</h1>
        {errorMessage && (
          <Alert message={errorMessage} type="error" onClose={() => setErrorMessage("")} />
        )}
        <InputField
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <InputField
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <InputField
          name="email"
          type="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleInputChange}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button
          label="Registrarse"
          onClick={handleRegister}
          type="primary"
          className="w-full"
        />
        <button
          className="w-full text-blue-500 hover:text-blue-400 text-sm mt-2"
          onClick={() => navigate("/login")}
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
      </div>
    </div>
  );
}

export default Signup;
