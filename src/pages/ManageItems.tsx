import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Item, Transaction } from "../services/api";
import useToken from "../hooks/useToken";
import Button from "../components/Button";

function ManageItems() {
  const { transaccionId } = useParams<{ transaccionId: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null); // Para obtener los datos de la transacción
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (transaccionId) {
      fetchTransactionAndItems(parseInt(transaccionId)); // Cargar la transacción y sus ítems
    }
  }, [transaccionId]);

  async function fetchTransactionAndItems(id: number) {
    try {
      const [transactionData, itemsData] = await Promise.all([
        api.getTransaction(token || "", id), // Obtener los datos de la transacción
        api.getItems(token || "", id), // Obtener los ítems asociados
      ]);
      setTransaction(transactionData); // Guardar los datos de la transacción
      setItems(itemsData); // Guardar los ítems
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
      fetchTransactionAndItems(parseInt(transaccionId || "0")); // Refrescar los ítems
    } catch (error) {
      console.error("Error al guardar el item:", error);
      alert("No se pudo guardar el item.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteItem(id, token || "");
      alert("Item eliminado.");
      fetchTransactionAndItems(parseInt(transaccionId || "0")); // Refrescar los ítems
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      alert("No se pudo eliminar el item.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Encabezado con el nombre de la transacción */}
      <div className="flex justify-between items-center bg-blue-100 py-4 px-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          {transaction?.destinatario || "Gestión de Items"}
        </h1>
        <div className="flex space-x-4">
          <Button label="Nuevo Item" onClick={() => openModal()} type="primary" />
          <Button label="Volver" onClick={() => navigate(-1)} type="secondary" />
        </div>
      </div>

      {/* Lista de items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">{item.nombre}</h3>
            <p className="text-gray-700">Precio: ${item.precio.toFixed(2)}</p>
            <p className="text-gray-500">Descripción: {item.descripcion}</p>
            <div className="flex justify-between mt-4">
              <Button label="Editar" onClick={() => openModal(item)} type="primary" />
              <Button label="Eliminar" onClick={() => handleDelete(item.id!)} type="danger" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar items */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {currentItem.id ? "Editar Item" : "Nuevo Item"}
            </h2>
            <input
              name="nombre"
              value={currentItem.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <input
              name="precio"
              type="number"
              value={currentItem.precio}
              onChange={handleInputChange}
              placeholder="Precio"
              className="w-full p-3 border rounded-lg mb-4"
            />
            <textarea
              name="descripcion"
              value={currentItem.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              className="w-full p-3 border rounded-lg mb-4"
            />
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

export default ManageItems;
