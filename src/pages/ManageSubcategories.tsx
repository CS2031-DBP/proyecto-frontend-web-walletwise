import React, { useState, useEffect } from "react";
import { api, SubcategoriaDto, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function ManageSubcategories() {
  const [subcategories, setSubcategories] = useState<SubcategoriaDto[]>([]);
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [currentSubcategory, setCurrentSubcategory] = useState<SubcategoriaDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubcategoriaDto | null>(null);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [subcategoriesData, categoriesData] = await Promise.all([
          api.getSubcategories(token || ""),
          api.getCategories(token || ""),
        ]);
        setSubcategories(subcategoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    fetchData();
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
    <div className="min-h-screen flex flex-col">
  <Header title="Gestión de Subcategorías" />
  <div className="flex-grow max-w-7xl mx-auto p-6">
    {/* Botones de acción centrados */}
    <div className="flex justify-center space-x-4 mb-6">
      <Button
        label="Nueva Subcategoría"
        onClick={() => openModal()}
        type="primary"
      />
      <Button
        label="Volver al Dashboard"
        onClick={() => navigate("/dashboard")}
        type="secondary"
      />
    </div>

    {/* Lista de Subcategorías */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[180px] flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-bold text-blue-600">
              {subcategory.nombre}
            </h3>
            <p className="text-gray-700 mt-2">{subcategory.descripcion}</p>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold">Categoría:</span>{" "}
              {subcategory.categoriaNombre || "Sin categoría"}
            </p>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
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

    {/* Modal para Crear/Editar */}
    {isModalOpen && currentSubcategory && (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          currentSubcategory.id ? "Editar Subcategoría" : "Nueva Subcategoría"
        }
      >
        <InputField
          name="nombre"
          value={currentSubcategory.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
        />
        <TextArea
          name="descripcion"
          value={currentSubcategory.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
        />
        <Select
          name="categoriaId"
          value={currentSubcategory.categoriaId}
          onChange={handleInputChange}
          options={[
            { value: "", label: "Selecciona una categoría" },
            ...categories.map((category) => ({
              value: category.id!,
              label: category.nombre,
            })),
          ]}
        />
        <div className="flex justify-between mt-4">
          <Button label="Cancelar" onClick={closeModal} type="secondary" />
          <Button
            label={
              currentSubcategory.id ? "Guardar Cambios" : "Crear Subcategoría"
            }
            onClick={handleSave}
            type="primary"
          />
        </div>
      </Modal>
    )}

    {/* Confirmación de Eliminación */}
    {subcategoryToDelete && (
      <Modal
        isOpen={!!subcategoryToDelete}
        onClose={() => setSubcategoryToDelete(null)}
      >
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
          <Button label="Eliminar" onClick={handleDelete} type="danger" />
        </div>
      </Modal>
    )}
  </div>
  <Footer />
</div>

  );
}

export default ManageSubcategories;
