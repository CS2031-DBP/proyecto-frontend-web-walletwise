import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, ReportDto } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Select from "../components/Select";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <div className="min-h-screen flex flex-col">
      <Header title="Gestión de Reportes" />
      <div className="flex-grow max-w-7xl mx-auto p-6">
        {/* Botones de acción */}
        <div className="flex justify-center mb-8 space-x-4">
          <Button label="Nuevo Reporte" onClick={() => openModal()} type="primary" />
          <Button
            label="Volver al Dashboard"
            onClick={() => navigate("/dashboard")}
            type="secondary"
          />
        </div>

        {/* Lista de reportes */}
        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <p className="text-gray-500">No hay reportes generados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} title={report.tipoReporte}>
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
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay transacciones asociadas.</p>
                )}
                <div className="flex justify-end mt-4">
                  <Button
                    label="Editar"
                    onClick={() => openModal(report)}
                    type="primary"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para crear/editar reportes */}
        {isModalOpen && currentReport && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={currentReport.id ? "Editar Reporte" : "Nuevo Reporte"}
          >
            <InputField
              name="fechaInicio"
              type="date"
              value={currentReport.fechaInicio}
              onChange={handleInputChange}
              placeholder="Fecha de Inicio"
            />
            <InputField
              name="fechaFin"
              type="date"
              value={currentReport.fechaFin}
              onChange={handleInputChange}
              placeholder="Fecha de Fin"
            />
            <Select
              name="tipoReporte"
              value={currentReport.tipoReporte}
              onChange={handleInputChange}
              options={[
                { value: "FINANCIERO", label: "Financiero" },
                { value: "GASTOS", label: "Gastos" },
                { value: "INGRESOS", label: "Ingresos" },
              ]}
            />
            <Select
              name="formato"
              value={currentReport.formato}
              onChange={handleInputChange}
              options={[
                { value: "JSON", label: "JSON" },
                { value: "PDF", label: "PDF" },
                { value: "CSV", label: "CSV" },
              ]}
            />
            <div className="flex justify-between">
              <Button label="Cancelar" onClick={closeModal} type="secondary" />
              <Button label="Guardar" onClick={handleSave} type="primary" />
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ManageReports;
