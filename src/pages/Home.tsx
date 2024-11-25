import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Encabezado */}
      <Header title="Bienvenido a WalletWise 😊" showLogout={false} />

      {/* Sección de características */}
      <section className="py-12 px-4 flex-grow">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          ¿Qué puedes hacer con WalletWise?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card title="Gestionar Cuentas">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920272.png"
              alt="Gestionar cuentas"
              className="w-16 mx-auto mb-4"
            />
            <p className="text-gray-700 mt-2">
              Crea y controla tus cuentas financieras de manera sencilla.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card title="Presupuestos Personalizados">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920401.png"
              alt="Presupuestos personalizados"
              className="w-16 mx-auto mb-4"
            />
            <p className="text-gray-700 mt-2">
              Configura límites y recibe alertas para controlar tus gastos.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card title="Análisis Detallado">
            <img
              src="https://media.discordapp.net/attachments/1278415903016489011/1310409478188961812/image-removebg-preview-71.png?format=webp&quality=lossless&width=1184&height=804"
              alt="Análisis detallado"
              className="w-16 mx-auto mb-4"
            />
            <p className="text-gray-700 mt-2">
              Revisa tus ingresos y gastos categorizados fácilmente.
            </p>
          </Card>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 bg-white w-full text-center">
        <h2 className="text-2xl font-bold text-blue-600">
          ¡Empieza a controlar tus finanzas hoy!
        </h2>
        <p className="text-gray-700 mt-2 mb-6">
          Inicia sesión o crea una cuenta para descubrir todas las funcionalidades.
        </p>
        <div className="space-x-4">
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
      <Footer />
    </div>
  );
}

export default Home;
