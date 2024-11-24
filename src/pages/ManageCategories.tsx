import React, { useState, useEffect } from "react";
import { api, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

// Extender el tipo CategoriaDto para incluir id
interface CategoriaConId extends CategoriaDto {
  id: number;
}

function ManageCategories() {
  const [categories, setCategories] = useState<CategoriaConId[]>([]);
  const [newCategory, setNewCategory] = useState<CategoriaDto>({
    nombre: "",
    descripcion: "",
    tipo: "Ingreso",
  });
  const [editingCategory, setEditingCategory] = useState<CategoriaConId | null>(
    null
  );
  const { token } = useToken();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };
  

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, editingCategory, token || "");
        alert("Categoría actualizada.");
        setEditingCategory(null);
      } else {
        await api.createCategory(newCategory, token || "");
        alert("Categoría creada.");
        setNewCategory({ nombre: "", descripcion: "", tipo: "Ingreso" });
      }
      const data = await api.getCategories(token || "");
      setCategories(data); // Actualiza la lista de categorías
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCategory(id, token || "");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      alert("Categoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>

      {/* Formulario para crear o editar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        </h2>
        <input
          name="nombre"
          value={editingCategory?.nombre || newCategory.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="descripcion"
          value={editingCategory?.descripcion || newCategory.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded mb-2"
        />
        <select
          name="tipo"
          value={editingCategory?.tipo || newCategory.tipo}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="Ingreso">Ingreso</option>
          <option value="Gasto">Gasto</option>
        </select>
        <div className="flex gap-4">
          <Button
            label={editingCategory ? "Guardar Cambios" : "Crear Categoría"}
            onClick={handleSave}
            type="primary"
          />
          {editingCategory && (
            <Button
              label="Cancelar"
              onClick={() => setEditingCategory(null)}
              type="secondary"
            />
          )}
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold">{category.nombre}</h3>
            <p>{category.descripcion}</p>
            <p className="text-gray-500">Tipo: {category.tipo}</p>
            <div className="flex justify-between mt-2">
              <Button
                label="Editar"
                onClick={() => setEditingCategory(category)}
                type="primary"
              />
              <Button
                label="Eliminar"
                onClick={() => handleDelete(category.id)}
                type="danger"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCategories;
