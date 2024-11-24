import React, { useState, useEffect } from "react";
import { api, SubcategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function ManageSubcategories() {
  const [subcategories, setSubcategories] = useState<SubcategoriaDto[]>([]);
  const [currentSubcategory, setCurrentSubcategory] = useState<SubcategoriaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubcategoriaDto | null>(null);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const data = await api.getSubcategories(token || "");
        setSubcategories(data);
      } catch (error) {
        console.error("Error al cargar subcategorías:", error);
      }
    }
    fetchSubcategories();
  }, [token]);

  const openModal = (subcategory?: SubcategoriaDto) => {
    setCurrentSubcategory(
      subcategory || { nombre: "", descripcion: "", categoriaId: 0 }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentSubcategory(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSubcategory((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!currentSubcategory) return;
    try {
      if (currentSubcategory.id) {
        await api.updateSubcategory(currentSubcategory.id, currentSubcategory, token || "");
        alert("Subcategoría actualizada.");
      } else {
        await api.createSubcategory(currentSubcategory, token || "");
        alert("Subcategoría creada.");
      }
      closeModal();
      const data = await api.getSubcategories(token || "");
      setSubcategories(data);
    } catch (error) {
      console.error("Error al guardar la subcategoría:", error);
      alert("No se pudo guardar la subcategoría.");
    }
  };

  const handleDelete = async () => {
    if (!subcategoryToDelete) return;
    try {
      await api.deleteSubcategory(subcategoryToDelete.id!, token || "");
      setSubcategories((prev) => prev.filter((sub) => sub.id !== subcategoryToDelete.id));
      alert("Subcategoría eliminada.");
      setSubcategoryToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la subcategoría:", error);
      alert("No se pudo eliminar la subcategoría.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-100 py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Gestión de Subcategorías</h1>
        <div className="flex space-x-4">
          <Button
            label="Nueva Subcategoría"
            onClick={() => openModal()}
            type="primary"
            className="flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nuevo</span>
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

      {/* Lista de Subcategorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-blue-600 mb-2">{subcategory.nombre}</h3>
            <p className="text-gray-700 mb-2">{subcategory.descripcion}</p>
            <p className="text-gray-500">
              <span className="font-semibold">Categoría:</span> {subcategory.categoriaNombre || "Sin categoría"}
            </p>
            <div className="flex justify-between mt-4">
              <Button
                label="Editar"
                onClick={() => openModal(subcategory)}
                type="primary"
                className="px-4"
              />
              <Button
                label="Eliminar"
                onClick={() => setSubcategoryToDelete(subcategory)}
                type="danger"
                className="px-4"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && currentSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {currentSubcategory.id ? "Editar Subcategoría" : "Nueva Subcategoría"}
            </h2>
            <input
              name="nombre"
              value={currentSubcategory.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <textarea
              name="descripcion"
              value={currentSubcategory.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <select
              name="categoriaId"
              value={currentSubcategory.categoriaId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              <option value="1">Categoría 1</option>
              <option value="2">Categoría 2</option>
            </select>
            <div className="flex justify-end space-x-4">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button
                label={currentSubcategory.id ? "Guardar Cambios" : "Crear"}
                onClick={handleSave}
                type="primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de Eliminación */}
      {subcategoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-center mb-4">
              ¿Eliminar Subcategoría?
            </h2>
            <p className="text-center mb-6">
              ¿Estás seguro de que deseas eliminar la subcategoría{" "}
              <span className="font-semibold">{subcategoryToDelete.nombre}</span>?
            </p>
            <div className="flex justify-around">
              <Button
                label="Cancelar"
                onClick={() => setSubcategoryToDelete(null)}
                type="secondary"
              />
              <Button
                label="Eliminar"
                onClick={handleDelete}
                type="danger"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSubcategories;

