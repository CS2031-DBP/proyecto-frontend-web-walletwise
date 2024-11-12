import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

function Dashboard() {
  const { token } = useToken();
  const navigate = useNavigate();

  // Redirigir al login si no hay token
  if (!token) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Sección de bienvenida */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl">Welcome back!</h2>
        <p>Here's a quick overview of your account.</p>
      </div>

      {/* Secciones de ejemplo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Account Statistics</h3>
          <p>Overview of your recent activity.</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <button className="mt-2 p-2 bg-blue-500 text-white rounded">New Action</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
