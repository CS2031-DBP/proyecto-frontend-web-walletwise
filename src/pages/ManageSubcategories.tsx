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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gestión de Subcategorías</h1>
      <Button
        label="Nueva Subcategoría"
        onClick={() => openModal()}
        type="primary"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {subcategories.map((subcategory) => (
          <div key={subcategory.id} className="p-4 border rounded shadow bg-white">
          <h3 className="text-lg font-bold">{subcategory.nombre}</h3>
          <p>{subcategory.descripcion}</p>
          <p>Categoría: {subcategory.categoriaNombre || "Sin categoría"}</p> {/* Mostrar el nombre de la categoría */}
          <div className="flex justify-between mt-4">
            <Button
              label="Editar"
              onClick={() => openModal(subcategory)}
              type="primary"
            />
            <Button
              label="Eliminar"
              onClick={() => setSubcategoryToDelete(subcategory)}
              type="danger"
            />
          </div>
        </div>        
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && currentSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold">
              {currentSubcategory.id ? "Editar Subcategoría" : "Nueva Subcategoría"}
            </h2>
            <input
              name="nombre"
              placeholder="Nombre"
              value={currentSubcategory.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-4"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={currentSubcategory.descripcion}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-4"
            />
            <input
              name="categoriaId"
              type="number"
              placeholder="Categoría ID"
              value={currentSubcategory.categoriaId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-4"
            />
            <div className="flex justify-between mt-4">
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

      {/* Confirmación de eliminación */}
      {subcategoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p>¿Estás seguro de que deseas eliminar esta subcategoría?</p>
            <div className="flex justify-between mt-4">
              <Button
                label="Cancelar"
                onClick={() => setSubcategoryToDelete(null)}
                type="secondary"
              />
              <Button label="Eliminar" onClick={handleDelete} type="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSubcategories;
