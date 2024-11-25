import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Header title="Perfil de Usuario" />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
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
      <Footer />
    </div>
  );
}

export default Profile;

