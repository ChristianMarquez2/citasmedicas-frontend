import { useState } from "react";
import { createSpecialty, updateSpecialty } from "../../api/specialties.api.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function SpecialtyForm({ specialty, onClose, onSaved }) {
  const [codigo, setCodigo] = useState(specialty?.codigo || "");
  const [nombre, setNombre] = useState(specialty?.nombre || "");
  const [descripcion, setDescripcion] = useState(specialty?.descripcion || "");

  const { showToast, Toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { codigo, nombre, descripcion };

    try {
      if (specialty) {
        await updateSpecialty(specialty._id, payload);
        showToast("Especialidad actualizada", "success");
      } else {
        await createSpecialty(payload);
        showToast("Especialidad creada", "success");
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast("Error guardando especialidad", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl mb-4">{specialty ? "Editar Especialidad" : "Nueva Especialidad"}</h2>

        <div className="mb-2">
          <label className="block mb-1">Código</label>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full border px-2 py-1"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-2 py-1"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Descripción</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-2 py-1"
            required
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-2 px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Guardar
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}
