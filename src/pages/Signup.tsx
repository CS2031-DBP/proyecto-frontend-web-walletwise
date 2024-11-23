import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { api, User } from "../services/api";

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
    if (!firstName || !lastName || !email || !password) return "Todos los campos son obligatorios.";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Introduce un correo válido.";
    return "";
  };

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      const res = await api.register({ ...formData, role: "user" });
      setToken({ token: res.token, role: res.role });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Error al registrarse. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Crear Cuenta</h1>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Nombre"
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Apellido"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Correo Electrónico"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Contraseña"
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-400"
          onClick={handleRegister}
        >
          Registrarse
        </button>
        <button
          className="w-full text-blue-500 hover:text-blue-400 text-sm mt-2"
          onClick={() => navigate("/")}
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
      </div>
    </div>
  );
}

export default Signup;
