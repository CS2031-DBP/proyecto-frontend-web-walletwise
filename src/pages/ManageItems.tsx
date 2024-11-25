import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Item, Transaction } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import TextArea from "../components/TextArea";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ManageItems() {
  const { transaccionId } = useParams<{ transaccionId: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (transaccionId) {
      fetchTransactionAndItems(parseInt(transaccionId));
    }
  }, [transaccionId]);

  async function fetchTransactionAndItems(id: number) {
    try {
      const [transactionData, itemsData] = await Promise.all([
        api.getTransaction(token || "", id),
        api.getItems(token || "", id),
      ]);
      setTransaction(transactionData);
      setItems(itemsData);
    } catch (error) {
      console.error("Error al obtener la transacción o los ítems:", error);
    }
  }

  const openModal = (item?: Item) => {
    setCurrentItem(
      item || {
        nombre: "",
        precio: 0,
        descripcion: "",
        transaccionId: parseInt(transaccionId || "0"),
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) =>
      prev ? { ...prev, [name]: name === "precio" ? parseFloat(value) : value } : null
    );
  };

  const handleSave = async () => {
    if (!currentItem) return;
    try {
      if (currentItem.id) {
        await api.updateItem(currentItem.id, currentItem, token || "");
        alert("Item actualizado.");
      } else {
        await api.createItem(currentItem, token || "");
        alert("Item creado.");
      }
      closeModal();
      fetchTransactionAndItems(parseInt(transaccionId || "0"));
    } catch (error) {
      console.error("Error al guardar el item:", error);
      alert("No se pudo guardar el item.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteItem(id, token || "");
      alert("Item eliminado.");
      fetchTransactionAndItems(parseInt(transaccionId || "0"));
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      alert("No se pudo eliminar el item.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={transaction?.destinatario || "Gestión de Items"} />
      <div className="flex-grow max-w-7xl mx-auto p-6">
        {/* Botones de acción */}
        <div className="flex justify-center mb-8 space-x-4">
          <Button label="Nuevo Item" onClick={() => openModal()} type="primary" />
          <Button
            label="Volver al Dashboard"
            onClick={() => navigate("/dashboard")}
            type="secondary"
          />
        </div>

        {/* Lista de items */}
        {items.length === 0 ? (
          <p className="text-gray-500">No hay ítems asociados a esta transacción.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white border rounded-lg shadow-md flex flex-col justify-between min-h-[150px]"
              >
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">{item.nombre}</h3>
                  <p className="text-gray-700 mt-2">
                    <strong>Precio:</strong> ${item.precio.toFixed(2)}
                  </p>
                  <p className="text-gray-500">
                    <strong>Descripción:</strong> {item.descripcion}
                  </p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button label="Editar" onClick={() => openModal(item)} type="primary" />
                  <Button label="Eliminar" onClick={() => handleDelete(item.id!)} type="danger" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear/editar items */}
        {isModalOpen && currentItem && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={currentItem.id ? "Editar Item" : "Nuevo Item"}
          >
            <InputField
              name="nombre"
              value={currentItem.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
            />
            <InputField
              name="precio"
              type="number"
              value={currentItem.precio}
              onChange={handleInputChange}
              placeholder="Precio"
            />
            <TextArea
              name="descripcion"
              value={currentItem.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
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

export default ManageItems;
