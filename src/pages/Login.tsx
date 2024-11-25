import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { api, LoginDto } from "../services/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Alert from "../components/Alert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  async function handleLogin() {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Por favor, completa ambos campos.");
      return;
    }

    const loginDto: LoginDto = { email, password };
    try {
      const res = await api.login(loginDto);
      setToken({ token: res.token, role: res.role });
      navigate(res.role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Credenciales inválidas. Intenta de nuevo.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h1>
        {errorMessage && (
          <Alert message={errorMessage} type="error" onClose={() => setErrorMessage("")} />
        )}
        <InputField
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          label="Ingresar"
          onClick={handleLogin}
          type="primary"
          className="w-full"
        />
        <button
          className="w-full text-blue-500 hover:text-blue-400 text-sm mt-2"
          onClick={() => navigate("/signup")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}

export default Login;
