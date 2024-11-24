import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // Asegúrate de que esto esté correctamente importado

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full bg-blue-600 text-white py-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Bienvenido a WalletWise 😊</h1>
          <p className="mt-4 text-lg">
            Gestiona tus finanzas de manera fácil, eficiente y organizada.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          ¿Qué puedes hacer con WalletWise?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920272.png"
              alt="Gestionar cuentas"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-600">
              Gestionar Cuentas
            </h3>
            <p className="text-gray-700 mt-2">
              Crea y controla tus cuentas financieras de manera sencilla.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920401.png"
              alt="Presupuestos personalizados"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-600">
              Presupuestos Personalizados
            </h3>
            <p className="text-gray-700 mt-2">
              Configura límites y recibe alertas para controlar tus gastos.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
              alt="Análisis detallado"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-600">
              Análisis Detallado
            </h3>
            <p className="text-gray-700 mt-2">
              Revisa tus ingresos y gastos categorizados fácilmente.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 bg-white w-full text-center">
        <h2 className="text-2xl font-bold text-blue-600">
          ¡Empieza a controlar tus finanzas hoy!
        </h2>
        <p className="text-gray-700 mt-2 mb-6">
          Inicia sesión o crea una cuenta para descubrir todas las
          funcionalidades.
        </p>
        <div className="space-x-4">
          {/* Cambiar la navegación a '/signup' */}
          <Button
            label="Registrarse"
            onClick={() => navigate("/signup")}
            type="primary"
          />
          <Button
            label="Iniciar Sesión"
            onClick={() => navigate("/login")}
            type="secondary"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-blue-600 text-white text-center">
        <p className="text-sm">
          © 2024 WalletWise. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Home;
