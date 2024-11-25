import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCategories from "./pages/ManageCategories"; // Importar la página de categorías
import EditAccount from "./pages/EditAccount"; // Importar la página de edición de cuentas
import ManageSubcategories from "./pages/ManageSubcategories";
import ManageBudgets from "./pages/ManageBudgets";
import ManageTransactions from "./pages/ManageTransactions";
import ManageItems from "./pages/ManageItems";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />
        
        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Administración */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Gestión de categorías */}
        <Route path="/categories" element={<ManageCategories />} />
        
        {/* Edición de cuentas */}
        <Route path="/edit-account/:id" element={<EditAccount />} />

       {/* Edición de subcategorias */}
        <Route path="/subcategories" element={<ManageSubcategories />} />

        <Route path="/budgets" element={<ManageBudgets />} />

        <Route path="/manage-transactions" element={<ManageTransactions />} />

        <Route path="/manage-items/:transaccionId" element={<ManageItems />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
