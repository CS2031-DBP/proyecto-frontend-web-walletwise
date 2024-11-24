import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <header className="w-full bg-blue-600 text-white py-10">
    <div className="text-center">
      <h1 className="text-5xl font-bold">{title}</h1>
      {subtitle && <p className="mt-4 text-lg">{subtitle}</p>}
    </div>
  </header>
);

export default Header;
