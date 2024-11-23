import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string; // Permite agregar clases personalizadas
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "primary",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring transition duration-200";
  const typeStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-300",
    secondary: "bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-400 focus:ring-red-300",
  };
  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${typeStyles[type]} ${
        disabled ? disabledStyles : ""
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
