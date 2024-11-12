import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../hooks/useToken";

type LoginDto = {
  email: string;
  password: string;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  async function handleLogin() {
    // Verificar que los campos no estén vacíos
    if (!email || !password) {
      alert("Please fill in both email and password fields.");
      return;
    }

    const loginDto: LoginDto = { email, password };
    try {
      const res = await axios.post("http://localhost:8080/auth/login", loginDto);
      
      // Guardar el token y rol del usuario
      setToken({ token: res.data.token, role: res.data.role });

      // Redirigir según el rol del usuario
      if (res.data.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Invalid credentials, please try again.");
    }
  }

  return (
    <div className="flex flex-col space-y-5 max-w-md mx-auto">
      <h1 className="text-xl text-center">Log in</h1>
      <input
        className="outline rounded p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        className="outline rounded p-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button className="text-blue-500 hover:text-blue-400" onClick={handleLogin}>
        Log in
      </button>
      <button
        className="text-blue-500 hover:text-blue-400 text-sm"
        onClick={() => navigate("/signup")}
      >
        Don't have an account? Sign up
      </button>
    </div>
  );
}

export default Login;
