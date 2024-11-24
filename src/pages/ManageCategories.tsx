import React, { useState, useEffect } from "react";
import { api, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom"; 

// Extender el tipo CategoriaDto para incluir id
interface CategoriaConId extends CategoriaDto {
  id: number;
}

function ManageCategories() {
  const [categories, setCategories] = useState<CategoriaConId[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoriaConId | CategoriaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoriaConId | null>(null);
  const { token } = useToken();
  const navigate = useNavigate(); // Usar useNavigate para redirigir

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories(token || "");
        setCategories(data); // Se espera que las categorías tengan id
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    }
    fetchCategories();
  }, [token]);

  const openModal = (category?: CategoriaConId) => {
    if (category) {
      setCurrentCategory(category);
    } else {
      setCurrentCategory({ nombre: "", descripcion: "", tipo: "INGRESO" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCategory(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!currentCategory) return;
    try {
      if ('id' in currentCategory) {
        await api.updateCategory(currentCategory.id, currentCategory, token || "");
        alert("Categoría actualizada.");
      } else {
        await api.createCategory(currentCategory as CategoriaDto, token || "");
        alert("Categoría creada.");
      }
      closeModal();
      const data = await api.getCategories(token || "");
      setCategories(data); // Actualiza la lista de categorías
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await api.deleteCategory(categoryToDelete.id, token || "");
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      alert("Categoría eliminada.");
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

 return (
  <div className="max-w-5xl mx-auto p-4">
    {/* Encabezado mejorado */}
    <div className="bg-blue-100 py-6 px-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold text-blue-700">Gestión de Categorías</h1>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <Button 
          label="Nueva Categoría" 
          onClick={() => openModal()} 
          type="primary" 
          className="flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Nueva Categoría</span>
        </Button>
        <Button 
          label="Volver al Dashboard" 
          onClick={() => navigate("/dashboard")} 
          type="secondary" 
          className="flex items-center space-x-2"
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </Button>
      </div>
    </div>

    {/* Lista de categorías */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="p-6 border rounded-lg shadow bg-white">
          <h3 className="text-xl font-bold text-blue-600 mb-2">{category.nombre}</h3>
          <p className="text-gray-700">{category.descripcion}</p>
          <p className="text-gray-500 mt-1">Tipo: {category.tipo}</p>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              label="Editar"
              onClick={() => openModal(category)}
              type="primary"
            />
            <Button
              label="Eliminar"
              onClick={() => setCategoryToDelete(category)}
              type="danger"
            />
          </div>
        </div>
      ))}
    </div>

    {/* Modal para crear/editar categoría */}
    {isModalOpen && currentCategory && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {('id' in currentCategory) ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <input
            name="nombre"
            value={currentCategory.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="descripcion"
            value={currentCategory.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="tipo"
            value={currentCategory.tipo}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INGRESO">Ingreso</option>
            <option value="GASTO">Gasto</option>
          </select>
          <div className="flex justify-between">
            <Button label="Cancelar" onClick={closeModal} type="secondary" />
            <Button
              label={('id' in currentCategory) ? "Guardar Cambios" : "Crear Categoría"}
              onClick={handleSave}
              type="primary"
            />
          </div>
        </div>
      </div>
    )}

    {/* Modal de confirmación para eliminar */}
    {categoryToDelete && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-lg font-bold text-center mb-4">
            ¿Eliminar Categoría?
          </h2>
          <p className="text-center mb-6">
            ¿Estás seguro de que deseas eliminar la categoría "<span className="font-semibold">{categoryToDelete.nombre}</span>"?
          </p>
          <div className="flex justify-around">
            <Button label="Cancelar" onClick={() => setCategoryToDelete(null)} type="secondary" />
            <Button label="Eliminar" onClick={handleDelete} type="danger" />
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default ManageCategories;
