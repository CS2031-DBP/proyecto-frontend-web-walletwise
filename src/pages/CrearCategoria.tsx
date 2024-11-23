import { useState } from "react";
import { api, CategoriaDto } from "../services/api";
import useToken from "../hooks/useToken";

function CrearCategoria() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<"Ingreso" | "Gasto">("Ingreso");
  const { token } = useToken();

  async function handleCrearCategoria() {
    if (!nombre || !descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevaCategoria: CategoriaDto = { nombre, descripcion, tipo };

    try {
      await api.crearCategoria(nuevaCategoria, token || "");
      alert("Categoría creada exitosamente.");
    } catch (error: unknown) {
      console.error(error);
      alert("Error al crear la categoría.");
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Crear Categoría</h1>
      <input
        className="outline rounded p-2 w-full"
        placeholder="Nombre"
        onChange={(e) => setNombre(e.target.value)}
      />
      <textarea
        className="outline rounded p-2 w-full"
        placeholder="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <select
        className="outline rounded p-2 w-full"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as "Ingreso" | "Gasto")}
      >
        <option value="Ingreso">Ingreso</option>
        <option value="Gasto">Gasto</option>
      </select>
      <button
        className="bg-blue-500 text-white py-2 rounded w-full"
        onClick={handleCrearCategoria}
      >
        Crear
      </button>
    </div>
  );
}

export default CrearCategoria;
