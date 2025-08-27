import { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "../api/appointments.api.js";
import { getPatients } from "../api/patients.api.js";
import { getSpecialties } from "../api/specialties.api.js";
import AppointmentForm from "../components/forms/AppointmentForm.jsx";
import { useToast } from "../hooks/useToast.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AppointmentsPage.css"; // Importamos los estilos CSS

// Función helper para extraer el array de la respuesta
const extractArray = (data, possibleKeys = ['data', 'items', 'patients', 'appointments', 'specialties']) => {
  if (Array.isArray(data)) return data;

  for (const key of possibleKeys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key];
    }
  }

  console.warn("No se pudo encontrar un array en la respuesta:", data);
  return [];
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast, Toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Citas - Dashboard";
    fetchData();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      console.log("Estructura de la primera cita:", appointments[0]);
      console.log("Paciente en cita:", appointments[0].id_paciente);
      console.log("Especialidad en cita:", appointments[0].id_especialidad);
    }
  }, [appointments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptResponse, patResponse, specResponse] = await Promise.all([
        getAppointments(),
        getPatients(),
        getSpecialties()
      ]);

      console.log("Respuesta de pacientes:", patResponse);

      setAppointments(extractArray(apptResponse, ['data', 'items', 'appointments']));
      setPatients(extractArray(patResponse, ['data', 'items', 'patients']));
      setSpecialties(extractArray(specResponse, ['data', 'items', 'specialties']));

    } catch (error) {
      showToast("Error cargando datos", "error");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appt) => {
    setEditingAppointment(appt);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta cita?")) return;
    setDeletingId(id);
    try {
      await deleteAppointment(id);
      showToast("Cita eliminada correctamente", "success");
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Error al eliminar la cita", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="appointments-content">
          <div className="appointments-header">
            <h1 className="welcome-title">
              Bienvenido, {user?.user?.nombre || "Usuario"}
            </h1>

            <div className="appointments-title-section">
              <h2 className="page-title">Gestión de Citas</h2>
              <button
                className="btn-new-appointment"
                onClick={() => {
                  setEditingAppointment(null);
                  setShowForm(true);
                }}
              >
                <i className="fas fa-calendar-plus"></i>
                Nueva Cita
              </button>
            </div>
          </div>

          {showForm && (
            <AppointmentForm
              appointment={editingAppointment}
              onClose={() => setShowForm(false)}
              onSaved={fetchData}
              patients={patients}
              specialties={specialties}
            />
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando citas...</p>
            </div>
          ) : (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Paciente</th>
                    <th>Especialidad</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-appointments">
                        <div className="no-appointments-content">
                          <i className="fas fa-calendar-times"></i>
                          <p>No hay citas registradas</p>
                          <button
                            className="btn-add-first"
                            onClick={() => {
                              setEditingAppointment(null);
                              setShowForm(true);
                            }}
                          >
                            Agregar primera cita
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a._id} className="appointment-row">
                        <td className="appointment-data appointment-code">{a.codigo}</td>
                        <td className="appointment-data appointment-description">{a.descripcion}</td>
                        <td className="appointment-data appointment-patient">
                          {a.id_paciente ? `${a.id_paciente.nombre} ${a.id_paciente.apellido}` : 'N/A'}
                        </td>
                        <td className="appointment-data appointment-specialty">
                          {a.id_especialidad ? a.id_especialidad.nombre : 'N/A'}
                        </td>
                        <td className="appointment-data appointment-date">
                          {a.fecha ? formatDate(a.fecha) : 'N/A'}
                        </td>
                        <td className="appointment-actions">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(a)}
                            title="Editar cita"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(a._id)}
                            disabled={deletingId === a._id}
                            title="Eliminar cita"
                          >
                            {deletingId === a._id ? "⏳ Eliminando..." : "🗑️ Eliminar"}
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