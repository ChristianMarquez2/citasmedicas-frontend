import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "../api/patients.api.js";
import PatientForm from "../components/forms/PatientForm.jsx";
import { useToast } from "../hooks/useToast.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PatientsPage.css"; // Importamos los estilos CSS

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast, Toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Pacientes - Dashboard";
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getPatients();

      if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
      } else if (response.patients && Array.isArray(response.patients)) {
        setPatients(response.patients);
      } else if (response.items && Array.isArray(response.items)) {
        setPatients(response.items);
      } else if (Array.isArray(response)) {
        setPatients(response);
      } else {
        setPatients([]);
      }
    } catch (error) {
      showToast("Error cargando pacientes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este paciente?")) return;
    setDeletingId(id);
    try {
      await deletePatient(id);
      showToast("Paciente eliminado correctamente", "success");
      fetchPatients();
    } catch (error) {
      showToast(error.response?.data?.message || "Error al eliminar el paciente", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="patients-content">
          <div className="patients-header">
            <h1 className="welcome-title">
              Bienvenido, {user?.user?.nombre || "Usuario"}
            </h1>

            <div className="patients-title-section">
              <h2 className="page-title">Gestión de Pacientes</h2>
              <button
                className="btn-new-patient"
                onClick={() => {
                  setEditingPatient(null);
                  setShowForm(true);
                }}
              >
                <i className="fas fa-plus"></i>
                Nuevo Paciente
              </button>
            </div>
          </div>

          {showForm && (
            <PatientForm
              patient={editingPatient}
              onClose={() => setShowForm(false)}
              onSaved={fetchPatients}
            />
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando pacientes...</p>
            </div>
          ) : (
            <div className="patients-table-container">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-patients">
                        <div className="no-patients-content">
                          <i className="fas fa-users"></i>
                          <p>No hay pacientes registrados</p>
                          <button
                            className="btn-add-first"
                            onClick={() => {
                              setEditingPatient(null);
                              setShowForm(true);
                            }}
                          >
                            Agregar primer paciente
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr key={p._id} className="patient-row">
                        <td className="patient-data">{p.nombre}</td>
                        <td className="patient-data">{p.apellido}</td>
                        <td className="patient-data">{p.cedula}</td>
                        <td className="patient-data">{p.telefono}</td>
                        <td className="patient-data">{p.email}</td>
                        <td className="patient-actions">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(p)}
                            title="Editar paciente"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            title="Eliminar paciente"
                          >
                            🗑️ Eliminar
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