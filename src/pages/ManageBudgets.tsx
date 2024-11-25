import React, { useState, useEffect } from "react";
import { api, PresupuestoDto, CategoriaDto } from "../services/api";
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

function ManageBudgets() {
  const [budgets, setBudgets] = useState<PresupuestoDto[]>([]);
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [currentBudget, setCurrentBudget] = useState<PresupuestoDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<PresupuestoDto | null>(null);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [budgetsData, categoriesData] = await Promise.all([
          api.getBudgets(token || ""),
          api.getCategories(token || "") as Promise<CategoriaDto[]>,
        ]);

        // Mapear los presupuestos para agregar 'categoriaNombre'
        const budgetsWithCategoryName = budgetsData.map((budget) => {
          const category = categoriesData.find(
            (cat: CategoriaDto) => cat.id === budget.categoriaId
          );
          return {
            ...budget,
            categoriaNombre: category ? category.nombre : "Sin categoría",
          };
        });

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
        await api.updateBudget(currentBudget.id, currentBudget, token || "");
        alert("Presupuesto actualizado.");
      } else {
        await api.createBudget(currentBudget, token || "");
        alert("Presupuesto creado.");
      }
      closeModal();
      const updatedBudgets = await api.getBudgets(token || "");
      setBudgets(updatedBudgets);
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
    <div className="min-h-screen flex flex-col">
      <Header title="Gestión de Presupuestos" />
      <div className="flex-grow max-w-7xl mx-auto p-6">
        {/* Botones de acción */}
        <div className="flex justify-center mb-8 space-x-4">
          <Button label="Nuevo Presupuesto" onClick={() => openModal()} type="primary" />
          <Button
            label="Volver al Dashboard"
            onClick={() => navigate("/dashboard")}
            type="secondary"
          />
        </div>

        {/* Lista de presupuestos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="p-6 bg-white border rounded-lg shadow-md flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-600">
                  {budget.categoriaNombre || "Sin categoría"}
                </h3>
                <p className="text-gray-700 mt-2">
                  <strong>Monto Total:</strong> {budget.montoTotal}
                </p>
                <p className="text-gray-500">
                  <strong>Gasto Actual:</strong> {budget.gastoActual}
                </p>
                <p className="text-gray-500">
                  <strong>Periodo:</strong> {budget.periodo}
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
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
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={currentBudget.id ? "Editar Presupuesto" : "Nuevo Presupuesto"}
          >
            <InputField
              name="montoTotal"
              type="number"
              value={currentBudget.montoTotal}
              onChange={handleInputChange}
              placeholder="Monto Total"
            />
            <TextArea
              name="alerta"
              value={currentBudget.alerta}
              onChange={handleInputChange}
              placeholder="Alerta (opcional)"
            />
            <Select
              name="periodo"
              value={currentBudget.periodo}
              onChange={handleInputChange}
              options={[
                { value: "MENSUAL", label: "Mensual" },
                { value: "ANUAL", label: "Anual" },
                { value: "SEMANAL", label: "Semanal" },
              ]}
            />
            <Select
              name="categoriaId"
              value={currentBudget.categoriaId}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Selecciona una categoría" },
                ...categories.map((category) => ({
                  value: category.id!,
                  label: category.nombre,
                })),
              ]}
            />
            <div className="flex justify-between space-x-4">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button
                label={currentBudget.id ? "Guardar Cambios" : "Crear"}
                onClick={handleSave}
                type="primary"
              />
            </div>
          </Modal>
        )}

        {/* Confirmación de eliminación */}
        {budgetToDelete && (
          <Modal
            isOpen={!!budgetToDelete}
            onClose={() => setBudgetToDelete(null)}
          >
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
          </Modal>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ManageBudgets;
