import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

interface Transaction {
  id: number;
  monto: number;
  destinatario: string;
  fecha: string;
  tipo: string;
  cuentaId: number;
  categoriaId: number;
}

interface Report {
  id: number;
  fechaGeneracion: string;
  tipoReporte: "FINANCIERO" | "GASTOS" | "INGRESOS";
  fechaInicio: string;
  fechaFin: string;
  formato: "JSON" | "PDF" | "CSV";
  transacciones: Transaction[];
}

function ManageReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await api.getReports(token || "");
        setReports(data);
      } catch (error) {
        console.error("Error al cargar los reportes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [token]);

  const openModal = (report?: Report) => {
    setCurrentReport(
      report || {
        id: 0,
        fechaGeneracion: new Date().toISOString().split("T")[0],
        tipoReporte: "FINANCIERO",
        fechaInicio: "",
        fechaFin: "",
        formato: "JSON",
        transacciones: [],
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentReport(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentReport((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleSave = async () => {
    if (!currentReport) return;
    try {
      if (currentReport.id) {
        await api.updateReport(
          currentReport.id,
          {
            ...currentReport,
            tipoReporte: currentReport.tipoReporte as "FINANCIERO" | "GASTOS" | "INGRESOS",
          },
          token || ""
        );
        alert("Reporte actualizado.");
      } else {
        await api.createReport(
          {
            ...currentReport,
            tipoReporte: currentReport.tipoReporte as "FINANCIERO" | "GASTOS" | "INGRESOS",
          },
          token || ""
        );
        alert("Reporte creado.");
      }
      closeModal();
      const data = await api.getReports(token || "");
      setReports(data);
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
        <Button
            label="Volver al Dashboard"
            onClick={() => navigate("/dashboard")}
            type="secondary"
          />
      </div>

      {/* Lista de reportes */}
      {loading ? (
        <p className="text-gray-500">Cargando reportes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold text-blue-600">{report.tipoReporte}</h3>
              <p className="text-gray-700">Desde: {report.fechaInicio}</p>
              <p className="text-gray-700">Hasta: {report.fechaFin}</p>
              <p className="text-gray-500">Formato: {report.formato}</p>
              <h4 className="text-lg font-bold mt-4">Transacciones:</h4>
              {report.transacciones.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {report.transacciones.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="p-2 bg-gray-100 rounded shadow"
                    >
                      <p><strong>Destinatario:</strong> {transaction.destinatario}</p>
                      <p><strong>Monto:</strong> {transaction.monto}</p>
                      <p><strong>Fecha:</strong> {transaction.fecha}</p>
                      <p><strong>Tipo:</strong> {transaction.tipo}</p>
                      <p><strong>Cuenta ID:</strong> {transaction.cuentaId}</p>
                      <p><strong>Categoría ID:</strong> {transaction.categoriaId}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay transacciones asociadas.</p>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  label="Editar"
                  onClick={() => openModal(report)}
                  type="primary"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar reportes */}
      {isModalOpen && currentReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {currentReport.id ? "Editar Reporte" : "Nuevo Reporte"}
            </h2>
            <input
              name="fechaInicio"
              type="date"
              value={currentReport.fechaInicio}
              onChange={handleInputChange}
              placeholder="Fecha de Inicio"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              name="fechaFin"
              type="date"
              value={currentReport.fechaFin}
              onChange={handleInputChange}
              placeholder="Fecha de Fin"
              className="w-full p-3 border rounded-lg mb-4"
            />
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
