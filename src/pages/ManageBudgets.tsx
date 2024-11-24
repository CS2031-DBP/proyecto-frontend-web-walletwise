import React, { useState, useEffect } from "react";
import { api, PresupuestoDto, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

function ManageBudgets() {
  const [budgets, setBudgets] = useState<PresupuestoDto[]>([]);
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [currentBudget, setCurrentBudget] = useState<PresupuestoDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<PresupuestoDto | null>(null);
  const { token } = useToken();

  // Fetch budgets and categories on load
  useEffect(() => {
    async function fetchData() {
      try {
        const [budgetsData, categoriesData] = await Promise.all([
          api.getBudgets(token || ""),
          api.getCategories(token || ""),
        ]);
  
        // Asignar nombres de categoría a los presupuestos
        const budgetsWithCategoryName = budgetsData.map((budget) => ({
            ...budget,
            categoriaNombre:
              categoriesData.find((category: CategoriaDto) => category.id === budget.categoriaId)?.nombre ||
              "Sin categoría",
          }));          
  
        setBudgets(budgetsWithCategoryName);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    fetchData();
  }, [token]);
  
  

  const openModal = (budget?: PresupuestoDto) => {
    setCurrentBudget(
      budget || {
        montoTotal: 0,
        alerta: "",
        gastoActual: 0,
        periodo: "MENSUAL",
        categoriaId: 0,
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentBudget(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentBudget((prev) =>
      prev ? { ...prev, [name]: name === "montoTotal" ? parseFloat(value) : value } : null
    );
  };

  const handleSave = async () => {
    if (!currentBudget || !currentBudget.categoriaId) {
      alert("Por favor, selecciona una categoría.");
      return;
    }
  
    try {
      if (currentBudget.id) {
        // Actualizar presupuesto existente
        await api.updateBudget(currentBudget.id, currentBudget, token || "");
        alert("Presupuesto actualizado.");
      } else {
        // Crear nuevo presupuesto
        await api.createBudget(currentBudget, token || "");
        alert("Presupuesto creado.");
      }
  
      // Obtener presupuestos y categorías actualizados
      const [updatedBudgets, updatedCategories] = await Promise.all([
        api.getBudgets(token || ""),
        api.getCategories(token || ""),
      ]);
  
      const budgetsWithCategoryName = updatedBudgets.map((budget) => ({
        ...budget,
        categoriaNombre:
          updatedCategories.find((category: CategoriaDto) => category.id === budget.categoriaId)?.nombre ||
          "Sin categoría",
      }));
  
      setBudgets(budgetsWithCategoryName);
      setCategories(updatedCategories);
      closeModal();
    } catch (error) {
      console.error("Error al guardar el presupuesto:", error);
      alert("No se pudo guardar el presupuesto.");
    }
  };
  

  const handleDelete = async () => {
    if (!budgetToDelete) return;

    try {
      await api.deleteBudget(budgetToDelete.id!, token || "");
      setBudgets((prev) => prev.filter((budget) => budget.id !== budgetToDelete.id));
      alert("Presupuesto eliminado.");
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el presupuesto:", error);
      alert("No se pudo eliminar el presupuesto.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-100 py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Gestión de Presupuestos</h1>
        <Button label="Nuevo Presupuesto" onClick={() => openModal()} type="primary" />
      </div>

      {/* Lista de presupuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              {budget.categoriaNombre || "Sin categoría"}
            </h3>
            <p className="text-gray-700">Monto Total: {budget.montoTotal}</p>
            <p className="text-gray-500">Gasto Actual: {budget.gastoActual}</p>
            <p className="text-gray-500">Periodo: {budget.periodo}</p>
            <div className="flex justify-between mt-4">
              <Button label="Editar" onClick={() => openModal(budget)} type="primary" />
              <Button
                label="Eliminar"
                onClick={() => setBudgetToDelete(budget)}
                type="danger"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar presupuesto */}
      {isModalOpen && currentBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {currentBudget.id ? "Editar Presupuesto" : "Nuevo Presupuesto"}
            </h2>
            <input
              name="montoTotal"
              value={currentBudget.montoTotal}
              onChange={handleInputChange}
              placeholder="Monto Total"
              type="number"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <textarea
              name="alerta"
              value={currentBudget.alerta}
              onChange={handleInputChange}
              placeholder="Alerta (opcional)"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <select
              name="periodo"
              value={currentBudget.periodo}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="MENSUAL">Mensual</option>
              <option value="ANUAL">Anual</option>
              <option value="SEMANAL">Semanal</option>
            </select>
            <select
              name="categoriaId"
              value={currentBudget.categoriaId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            <div className="flex justify-between space-x-4">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button
                label={currentBudget.id ? "Guardar Cambios" : "Crear"}
                onClick={handleSave}
                type="primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {budgetToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-center mb-4">
              ¿Eliminar Presupuesto?
            </h2>
            <p className="text-center mb-6">
              ¿Estás seguro de que deseas eliminar el presupuesto de la categoría{" "}
              <span className="font-semibold">{budgetToDelete.categoriaNombre}</span>?
            </p>
            <div className="flex justify-around">
              <Button
                label="Cancelar"
                onClick={() => setBudgetToDelete(null)}
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

export default ManageBudgets;
