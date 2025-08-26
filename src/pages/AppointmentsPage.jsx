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
  const { showToast, Toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Citas - Dashboard";
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      console.log("Estructura de la primera cita:", appointments[0]);
      console.log("Paciente en cita:", appointments[0].id_paciente);
      console.log("Especialidad en cita:", appointments[0].id_especialidad);
    }
  }, [appointments]);

  useEffect(() => {
    fetchData();
  }, []);

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
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      await deleteAppointment(id);
      showToast("Cita eliminada", "success");
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Error al eliminar cita", "error");
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
            <h2 className="text-2xl mb-0">Citas</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                setEditingAppointment(null);
                setShowForm(true);
              }}
            >
              Nueva Cita
            </button>
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
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando citas...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left font-semibold">Código</th>
                    <th className="border p-3 text-left font-semibold">Descripción</th>
                    <th className="border p-3 text-left font-semibold">Paciente</th>
                    <th className="border p-3 text-left font-semibold">Especialidad</th>
                    <th className="border p-3 text-left font-semibold">Fecha</th>
                    <th className="border p-3 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No hay citas registradas
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50">
                        <td className="border p-3">{a.codigo}</td>
                        <td className="border p-3">{a.descripcion}</td>
                        <td className="border p-3">{a.id_paciente?.nombre} {a.id_paciente?.apellido}</td>
                        <td className="border p-3">{a.id_especialidad?.nombre}</td>
                        <td className="border p-3">{new Date(a.fecha).toLocaleString()}</td>
                        <td className="border p-3">
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              onClick={() => handleEdit(a)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              onClick={() => handleDelete(a._id)}
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