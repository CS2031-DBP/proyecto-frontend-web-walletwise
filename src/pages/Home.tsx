import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Bienvenido a WalletWise</h1>
      <p className="text-lg text-gray-700 text-center max-w-xl mb-6">
        WalletWise te ayuda a gestionar tus finanzas personales de manera fácil y eficiente. Registra tus transacciones, controla tus presupuestos, y mantén un seguimiento detallado de tus gastos e ingresos.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400"
        >
          Crear Cuenta
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

export default Home;

