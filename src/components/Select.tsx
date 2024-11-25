import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
  name,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
