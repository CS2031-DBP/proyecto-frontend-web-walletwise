import React from "react";
import Button from "./Button";

interface CardProps {
  title: string;
  description?: string;
  details?: { label: string; value: string | number }[];
  actions?: { label: string; type: "primary" | "secondary" | "danger"; onClick: () => void }[];
}

const Card: React.FC<CardProps> = ({ title, description, details = [], actions = [] }) => {
  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold text-blue-600">{title}</h3>
      {description && <p className="text-gray-700 mt-2">{description}</p>}
      <div className="mt-4 space-y-1">
        {details.map((detail, index) => (
          <p key={index} className="text-gray-500">
            <strong>{detail.label}:</strong> {detail.value}
          </p>
        ))}
      </div>
      <div className="flex justify-between mt-4 space-x-2">
        {actions.map((action, index) => (
          <Button key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default Card;
