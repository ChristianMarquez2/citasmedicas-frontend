import { useEffect, useState } from "react";
import { getSpecialties, deleteSpecialty } from "../api/specialties.api.js";
import SpecialtyForm from "../components/forms/SpecialtyForm.jsx";
import { useToast } from "../hooks/useToast.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Especialidades - Dashboard";
  }, []);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const response = await getSpecialties();
      
      if (response.data && Array.isArray(response.data)) {
        setSpecialties(response.data);
      } else if (response.specialties && Array.isArray(response.specialties)) {
        setSpecialties(response.specialties);
      } else if (response.items && Array.isArray(response.items)) {
        setSpecialties(response.items);
      } else if (Array.isArray(response)) {
        setSpecialties(response);
      } else {
        setSpecialties([]);
      }
    } catch (error) {
      showToast("Error cargando especialidades", "error");
    } finally {
      setLoading(false);
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
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="p-4 flex-grow-1">
          <h1 className="fs-3 fw-bold mb-4">
            Bienvenido, {user?.user?.nombre || "Usuario"}
          </h1>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-2xl mb-0">Especialidades</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                setEditingSpecialty(null);
                setShowForm(true);
              }}
            >
              Nueva Especialidad
            </button>
          </div>

          {showForm && (
            <SpecialtyForm
              specialty={editingSpecialty}
              onClose={() => setShowForm(false)}
              onSaved={fetchSpecialties}
            />
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando especialidades...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left font-semibold">Código</th>
                    <th className="border p-3 text-left font-semibold">Nombre</th>
                    <th className="border p-3 text-left font-semibold">Descripción</th>
                    <th className="border p-3 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                        No hay especialidades registradas
                      </td>
                    </tr>
                  ) : (
                    specialties.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="border p-3">{s.codigo}</td>
                        <td className="border p-3">{s.nombre}</td>
                        <td className="border p-3">{s.descripcion}</td>
                        <td className="border p-3">
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              onClick={() => handleEdit(s)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              onClick={() => handleDelete(s._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Toast />
        </main>
      </div>
    </div>
  );
}