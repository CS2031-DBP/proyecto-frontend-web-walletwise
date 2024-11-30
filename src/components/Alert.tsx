import React from "react";
interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
  //una funcion opcional que se ejecuta cuando se cierra la alerta
}

const Alert: React.FC<AlertProps> = ({ message, type = "info", onClose }) => {
  const typeStyles = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={`p-4 border rounded mb-4 ${typeStyles[type]} flex justify-between items-center`}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
