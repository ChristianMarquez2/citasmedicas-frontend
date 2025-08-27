import { useEffect, useState } from "react";
import { getSpecialties, deleteSpecialty } from "../api/specialties.api.js";
import SpecialtyForm from "../components/forms/SpecialtyForm.jsx";
import { useToast } from "../hooks/useToast.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SpecialtiesPage.css"; // Importamos los estilos CSS

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast, Toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Especialidades - Dashboard";
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
    if (!window.confirm("¿Está seguro de que desea eliminar esta especialidad?")) return;
    setDeletingId(id);
    try {
      await deleteSpecialty(id);
      showToast("Especialidad eliminada correctamente", "success");
      fetchSpecialties();
    } catch (error) {
      showToast("Error al eliminar la especialidad", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="specialties-content">
          <div className="specialties-header">
            <h1 className="welcome-title">
              Bienvenido, {user?.user?.nombre || "Usuario"}
            </h1>

            <div className="specialties-title-section">
              <h2 className="page-title">Gestión de Especialidades</h2>
              <button
                className="btn-new-specialty"
                onClick={() => {
                  setEditingSpecialty(null);
                  setShowForm(true);
                }}
              >
                <i className="fas fa-plus"></i>
                Nueva Especialidad
              </button>
            </div>
          </div>

          {showForm && (
            <SpecialtyForm
              specialty={editingSpecialty}
              onClose={() => setShowForm(false)}
              onSaved={fetchSpecialties}
            />
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando especialidades...</p>
            </div>
          ) : (
            <div className="specialties-table-container">
              <table className="specialties-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-specialties">
                        <div className="no-specialties-content">
                          <i className="fas fa-stethoscope"></i>
                          <p>No hay especialidades registradas</p>
                          <button
                            className="btn-add-first"
                            onClick={() => {
                              setEditingSpecialty(null);
                              setShowForm(true);
                            }}
                          >
                            Agregar primera especialidad
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    specialties.map((s) => (
                      <tr key={s._id} className="specialty-row">
                        <td className="specialty-data specialty-code">{s.codigo}</td>
                        <td className="specialty-data specialty-name">{s.nombre}</td>
                        <td className="specialty-data specialty-description">{s.descripcion}</td>
                        <td className="specialty-actions">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(s)}
                            title="Editar especialidad"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(s._id)}
                            disabled={deletingId === s._id}
                            title="Eliminar especialidad"
                          >
                            {deletingId === s._id ? "⏳ Eliminando..." : "🗑️ Eliminar"}
                          </button>

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