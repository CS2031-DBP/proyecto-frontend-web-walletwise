import React, { useState, useEffect } from "react";
import { api, PresupuestoDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

function ManageBudgets() {
  const [budgets, setBudgets] = useState<PresupuestoDto[]>([]);
  const [currentBudget, setCurrentBudget] = useState<PresupuestoDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<PresupuestoDto | null>(null);
  const { token } = useToken();

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const data = await api.getBudgets(token || "");
        setBudgets(data);
      } catch (error) {
        console.error("Error al cargar presupuestos:", error);
      }
    }
    fetchBudgets();
  }, [token]);

  const openModal = (budget?: PresupuestoDto) => {
    setCurrentBudget(
      budget || { montoTotal: 0, alerta: "", gastoActual: 0, periodo: "MENSUAL", categoriaId: 0 }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentBudget(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBudget((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!currentBudget) return;
    try {
      if (currentBudget.id) {
        await api.updateBudget(currentBudget.id, currentBudget, token || "");
        alert("Presupuesto actualizado.");
      } else {
        await api.createBudget(currentBudget, token || "");
        alert("Presupuesto creado.");
      }
      closeModal();
      const data = await api.getBudgets(token || "");
      setBudgets(data);
    } catch (error) {
      console.error("Error al guardar el presupuesto:", error);
      alert("No se pudo guardar el presupuesto.");
    }
  };

  const handleDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await api.deleteBudget(budgetToDelete.id!, token || "");
      setBudgets((prev) => prev.filter((b) => b.id !== budgetToDelete.id));
      alert("Presupuesto eliminado.");
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el presupuesto:", error);
      alert("No se pudo eliminar el presupuesto.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Gestión de Presupuestos</h1>
      <Button label="Nuevo Presupuesto" onClick={() => openModal()} type="primary" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-xl font-bold text-blue-600">Presupuesto</h3>
            <p>Monto Total: {budget.montoTotal}</p>
            <p>Gasto Actual: {budget.gastoActual}</p>
            <p>Periodo: {budget.periodo}</p>
            <p>Alerta: {budget.alerta}</p>
            <div className="flex justify-between mt-4">
              <Button label="Editar" onClick={() => openModal(budget)} type="primary" />
              <Button label="Eliminar" onClick={() => setBudgetToDelete(budget)} type="danger" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      {isModalOpen && currentBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold">
              {currentBudget.id ? "Editar Presupuesto" : "Nuevo Presupuesto"}
            </h2>
            <input
              name="montoTotal"
              type="number"
              placeholder="Monto Total"
              value={currentBudget.montoTotal}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />
            <input
              name="gastoActual"
              type="number"
              placeholder="Gasto Actual"
              value={currentBudget.gastoActual}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />
            <input
              name="alerta"
              placeholder="Alerta"
              value={currentBudget.alerta}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />
            <select
              name="periodo"
              value={currentBudget.periodo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            >
              <option value="MENSUAL">Mensual</option>
              <option value="SEMANAL">Semanal</option>
              <option value="ANUAL">Anual</option>
            </select>
            <input
              name="categoriaId"
              type="number"
              placeholder="Categoría ID"
              value={currentBudget.categoriaId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-2"
            />
            <div className="flex justify-end mt-4">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button label="Guardar" onClick={handleSave} type="primary" />
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {budgetToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p>¿Estás seguro de eliminar este presupuesto?</p>
            <div className="flex justify-between mt-4">
              <Button label="Cancelar" onClick={() => setBudgetToDelete(null)} type="secondary" />
              <Button label="Eliminar" onClick={handleDelete} type="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBudgets;
