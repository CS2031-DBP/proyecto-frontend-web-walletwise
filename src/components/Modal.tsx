import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-red-500 hover:underline">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
