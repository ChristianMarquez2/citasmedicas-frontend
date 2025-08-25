import { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "../api/appointments.api.js";
import { getPatients } from "../api/patients.api.js";
import { getSpecialties } from "../api/specialties.api.js";
import AppointmentForm from "../components/forms/AppointmentForm.jsx";
import { useToast } from "../hooks/useToast.jsx";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptData, patData, specData] = await Promise.all([
        getAppointments(),
        getPatients(),
        getSpecialties()
      ]);
      setAppointments(apptData);
      setPatients(patData);
      setSpecialties(specData);
    } catch (error) {
      showToast("Error cargando datos", "error");
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
      showToast("Error al eliminar cita", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Citas</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setEditingAppointment(null);
          setShowForm(true);
        }}
      >
        Nueva Cita
      </button>

      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onClose={() => setShowForm(false)}
          onSaved={fetchData}
          patients={patients}
          specialties={specialties}
        />
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Código</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Paciente</th>
            <th className="border p-2">Especialidad</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td className="border p-2">{a.codigo}</td>
              <td className="border p-2">{a.descripcion}</td>
              <td className="border p-2">{a.patient?.nombre} {a.patient?.apellido}</td>
              <td className="border p-2">{a.specialty?.nombre}</td>
              <td className="border p-2">{new Date(a.fecha).toLocaleString()}</td>
              <td className="border p-2">
                <button
                  className="mr-2 text-blue-600"
                  onClick={() => handleEdit(a)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(a._id)}
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
