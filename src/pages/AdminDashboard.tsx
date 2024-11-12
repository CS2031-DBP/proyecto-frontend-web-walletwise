import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

function AdminDashboard() {
  const { token, role } = useToken();
  const navigate = useNavigate();

  // Redirigir al login si no hay token o si no es admin
  if (!token || role !== "ADMIN") {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl">Hello Admin!</h2>
        <p>Here you can manage the system settings and user information.</p>
      </div>

      {/* Ejemplo de secciones para administradores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">User Management</h3>
          <p>View and manage registered users.</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">System Settings</h3>
          <p>Configure system preferences and security settings.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
