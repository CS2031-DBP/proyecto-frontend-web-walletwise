import { Route, Routes, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard"; // Importar Dashboard
import AdminDashboard from "./pages/AdminDashboard"; // Importar AdminDashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Nueva ruta */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
