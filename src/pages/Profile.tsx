import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Perfil de Usuario</h1>
        <p className="text-gray-700 mb-6">
          Bienvenido a tu perfil. Aquí puedes ver y gestionar tu información personal.
        </p>
        <Button
          label="Volver al Dashboard"
          onClick={() => navigate("/dashboard")}
          type="primary"
        />
      </div>
    </div>
  );
}

export default Profile;
