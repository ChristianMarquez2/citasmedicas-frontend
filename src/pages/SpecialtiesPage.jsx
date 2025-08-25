import { useEffect, useState } from "react";
import { getSpecialties, deleteSpecialty } from "../api/specialties.api.js";
import SpecialtyForm from "../components/forms/SpecialtyForm.jsx";
import { useToast } from "../hooks/useToast.jsx";

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const data = await getSpecialties();
      setSpecialties(data);
    } catch (error) {
      showToast("Error cargando especialidades", "error");
    }
  };

  const handleEdit = (specialty) => {
    setEditingSpecialty(specialty);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta especialidad?")) return;
    try {
      await deleteSpecialty(id);
      showToast("Especialidad eliminada", "success");
      fetchSpecialties();
    } catch (error) {
      showToast("Error al eliminar", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Especialidades</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setEditingSpecialty(null);
          setShowForm(true);
        }}
      >
        Nueva Especialidad
      </button>

      {showForm && (
        <SpecialtyForm
          specialty={editingSpecialty}
          onClose={() => setShowForm(false)}
          onSaved={fetchSpecialties}
        />
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Código</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((s) => (
            <tr key={s._id}>
              <td className="border p-2">{s.codigo}</td>
              <td className="border p-2">{s.nombre}</td>
              <td className="border p-2">{s.descripcion}</td>
              <td className="border p-2">
                <button
                  className="mr-2 text-blue-600"
                  onClick={() => handleEdit(s)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(s._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Toast />
    </div>
  );
}
