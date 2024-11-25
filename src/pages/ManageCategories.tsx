import React, { useState, useEffect } from "react";
import { api, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ManageCategories() {
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoriaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoriaDto | null>(null);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories(token || "");
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    }
    fetchCategories();
  }, [token]);

  const openModal = (category?: CategoriaDto) => {
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
    setCurrentCategory((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleSave = async () => {
    if (!currentCategory) return;
    try {
      if (currentCategory.id) {
        await api.updateCategory(currentCategory.id, currentCategory, token || "");
        alert("Categoría actualizada.");
      } else {
        await api.createCategory(currentCategory, token || "");
        alert("Categoría creada.");
      }
      closeModal();
      const data = await api.getCategories(token || "");
      setCategories(data);
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete || !categoryToDelete.id) {
      alert("No se pudo encontrar la categoría para eliminar.");
      return;
    }

    try {
      await api.deleteCategory(categoryToDelete.id, token || "");
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
      alert("Categoría eliminada exitosamente.");
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert("No se pudo eliminar la categoría. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Gestión de Categorías" />
      <div className="flex-grow max-w-5xl mx-auto p-4">
  {/* Botones de acción centrados */}
  <div className="flex justify-center space-x-4 my-6">
    <Button label="Nueva Categoría" onClick={() => openModal()} type="primary" />
    <Button
      label="Volver al Dashboard"
      onClick={() => navigate("/dashboard")}
      type="secondary"
    />
  </div>

  {/* Listado de categorías en dos columnas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {categories.map((category) => (
      <div
        key={category.id}
        className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[180px] flex flex-col justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold text-blue-600">{category.nombre}</h3>
          <p className="text-gray-700 mt-2">{category.descripcion}</p>
          <p className="text-gray-500 mt-1">
            <strong>Tipo:</strong> {category.tipo}
          </p>
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <Button
            label="Editar"
            onClick={() => openModal(category)}
            type="primary"
          />
          <Button
            label="Eliminar"
            onClick={() =>
              category.id
                ? setCategoryToDelete(category)
                : alert("No se puede eliminar esta categoría.")
            }
            type="danger"
          />
        </div>
      </div>
    ))}
  </div>




      </div>
  
      {/* Modal de edición/creación */}
      {isModalOpen && currentCategory && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={currentCategory.id ? "Editar Categoría" : "Nueva Categoría"}
        >
          <InputField
            name="nombre"
            value={currentCategory.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
          />
          <TextArea
            name="descripcion"
            value={currentCategory.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
          />
          <Select
            name="tipo"
            value={currentCategory.tipo}
            onChange={handleInputChange}
            options={[
              { value: "INGRESO", label: "Ingreso" },
              { value: "GASTO", label: "Gasto" },
            ]}
          />
          <div className="flex justify-between">
            <Button label="Cancelar" onClick={closeModal} type="secondary" />
            <Button
              label={currentCategory.id ? "Guardar Cambios" : "Crear Categoría"}
              onClick={handleSave}
              type="primary"
            />
          </div>
        </Modal>
      )}
  
      {/* Modal de confirmación de eliminación */}
      {categoryToDelete && (
        <Modal isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)}>
          <p className="text-center mb-6">
            ¿Estás seguro de que deseas eliminar la categoría "
            <span className="font-semibold">{categoryToDelete.nombre}</span>"?
          </p>
          <div className="flex justify-around">
            <Button
              label="Cancelar"
              onClick={() => setCategoryToDelete(null)}
              type="secondary"
            />
            <Button label="Eliminar" onClick={handleDelete} type="danger" />
          </div>
        </Modal>
      )}
  
      <Footer />
    </div>
  );
  
  
}

export default ManageCategories;
