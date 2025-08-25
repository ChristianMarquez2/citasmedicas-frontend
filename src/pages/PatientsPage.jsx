import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "../api/patients.api.js";
import PatientForm from "../components/forms/PatientForm.jsx";
import { useToast } from "../hooks/useToast.jsx";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      showToast("Error cargando pacientes", "error");
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este paciente?")) return;
    try {
      await deletePatient(id);
      showToast("Paciente eliminado", "success");
      fetchPatients();
    } catch (error) {
      showToast("Error al eliminar", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Pacientes</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setEditingPatient(null);
          setShowForm(true);
        }}
      >
        Nuevo Paciente
      </button>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onClose={() => setShowForm(false)}
          onSaved={fetchPatients}
        />
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">Cédula</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.nombre}</td>
              <td className="border p-2">{p.apellido}</td>
              <td className="border p-2">{p.cedula}</td>
              <td className="border p-2">{p.telefono}</td>
              <td className="border p-2">{p.email}</td>
              <td className="border p-2">
                <button
                  className="mr-2 text-blue-600"
                  onClick={() => handleEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(p._id)}
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
