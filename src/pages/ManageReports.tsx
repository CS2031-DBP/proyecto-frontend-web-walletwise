import React, { useState, useEffect } from "react";
import { api, ReportDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function ManageReports() {
  const [reports, setReports] = useState<ReportDto[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await api.getReports(token || "");
        setReports(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      }
    }
    fetchReports();
  }, [token]);

  const openModal = (report?: ReportDto) => {
    setCurrentReport(
      report || {
        tipoReporte: "FINANCIERO",
        fechaInicio: "",
        fechaFin: "",
        formato: "JSON",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentReport(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentReport((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleSave = async () => {
    if (!currentReport) return;
    if (new Date(currentReport.fechaInicio) > new Date(currentReport.fechaFin)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    try {
      await api.createReport(currentReport, token || "");
      alert("Reporte creado exitosamente.");
      closeModal();
      const updatedReports = await api.getReports(token || "");
      setReports(updatedReports);
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      alert("No se pudo guardar el reporte.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center bg-blue-100 py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Gestión de Reportes</h1>
        <Button label="Nuevo Reporte" onClick={() => openModal()} type="primary" />
      </div>

      {/* Lista de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">
              {report.tipoReporte}
            </h3>
            <p className="text-gray-700">
              Desde: {report.fechaInicio} <br />
              Hasta: {report.fechaFin}
            </p>
            <p className="text-gray-500">Formato: {report.formato}</p>
          </div>
        ))}
      </div>

      {/* Modal para crear reporte */}
      {isModalOpen && currentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Nuevo Reporte
            </h2>
            <select
              name="tipoReporte"
              value={currentReport.tipoReporte}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="FINANCIERO">Financiero</option>
              <option value="GASTOS">Gastos</option>
              <option value="INGRESOS">Ingresos</option>
            </select>
            <input
              type="date"
              name="fechaInicio"
              value={currentReport.fechaInicio}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              type="date"
              name="fechaFin"
              value={currentReport.fechaFin}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <select
              name="formato"
              value={currentReport.formato}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="JSON">JSON</option>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
            </select>
            <div className="flex justify-between">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button label="Guardar" onClick={handleSave} type="primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReports;
