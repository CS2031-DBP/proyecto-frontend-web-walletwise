import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

interface HeaderProps {
  title: string;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showLogout = true }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-blue-600 text-white py-6 px-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      {showLogout && (
        <Button
          label="Cerrar Sesión"
          onClick={() => navigate("/")}
          type="secondary"
          className="bg-red-500 hover:bg-red-600"
        />
      )}
    </header>
  );
};

export default Header;
