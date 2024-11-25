import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Alert from "../components/Alert";

function AdminDashboard() {
  const { token, role } = useToken();
  const navigate = useNavigate();

  // Redirigir al login si no hay token o si no es admin
  if (!token || role !== "ADMIN") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Admin Dashboard" />
      <div className="flex-grow max-w-4xl mx-auto p-4">
        <Alert
          message="Acceso exclusivo para administradores."
          type="info"
        />
        <Card title="Hello Admin!">
          <p>Aquí puedes gestionar la configuración del sistema y la información de los usuarios.</p>
        </Card>

        {/* Ejemplo de secciones para administradores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card title="User Management" className="bg-red-100">
            <p>Ver y gestionar usuarios registrados.</p>
          </Card>
          <Card title="System Settings" className="bg-yellow-100">
            <p>Configurar preferencias del sistema y ajustes de seguridad.</p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
