import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../hooks/useToken";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; 
};

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  // Función para verificar la seguridad de la contraseña
  function isPasswordSecure(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }

  async function handleRegister() {
    // Validaciones de los campos
    if (firstName.length <= 6) {
      alert("First name must be longer than 6 characters.");
      return;
    }
    if (lastName.length <= 6) {
      alert("Last name must be longer than 6 characters.");
      return;
    }
    if (!email.includes("@") || !email.endsWith(".com")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!isPasswordSecure(password)) {
      alert("Password must be at least 8 characters long and include a number and an uppercase letter.");
      return;
    }

    const user: User = { 
      firstName, 
      lastName, 
      email, 
      password, 
      role: "user" 
    };
    
    try {
      const res = await axios.post("http://localhost:8080/auth/register", user);
      setToken(res.data.token);
      navigate("/profile");
    } catch (error: unknown) {
      console.error(error);
      alert("Error during registration, please check your information.");
    }
  }

  return (
    <div className="flex flex-col space-y-5 max-w-md mx-auto">
      <h1 className="text-xl text-center">Sign up</h1>
      <input
        className="outline rounded p-2"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="outline rounded p-2"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        className="outline rounded p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="outline rounded p-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="text-blue-500 hover:text-blue-400" onClick={handleRegister}>
        Sign up
      </button>
      <button
        className="text-blue-500 hover:text-blue-400 text-sm"
        onClick={() => navigate("/")}
      >
        Already have an account? Log in
      </button>
    </div>
  );
}

export default Signup;
