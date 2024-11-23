import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CrearCategoria from "./pages/CrearCategoria";

function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} /> 
  <Route path="/signup" element={<Signup />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/crear-categoria" element={<CrearCategoria />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
