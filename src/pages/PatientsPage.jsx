import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "../api/patients.api.js";
import PatientForm from "../components/forms/PatientForm.jsx";
import { useToast } from "../hooks/useToast.jsx";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

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
  }, []);

  useEffect(() => {
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
    if (!confirm("¿Eliminar este paciente?")) return;
    setDeletingId(id);
    try {
      await deletePatient(id);
      showToast("Paciente eliminado", "success");
      fetchPatients();
    } catch (error) {
      showToast(error.response?.data?.message || "Error al eliminar", "error");
    } finally {
      setDeletingId(null);
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
            <h2 className="text-2xl mb-0">Pacientes</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                setEditingPatient(null);
                setShowForm(true);
              }}
            >
              Nuevo Paciente
            </button>
          </div>

          {showForm && (
            <PatientForm
              patient={editingPatient}
              onClose={() => setShowForm(false)}
              onSaved={fetchPatients}
            />
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando pacientes...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left font-semibold">Nombre</th>
                    <th className="border p-3 text-left font-semibold">Apellido</th>
                    <th className="border p-3 text-left font-semibold">Cédula</th>
                    <th className="border p-3 text-left font-semibold">Teléfono</th>
                    <th className="border p-3 text-left font-semibold">Email</th>
                    <th className="border p-3 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No hay pacientes registrados
                      </td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="border p-3">{p.nombre}</td>
                        <td className="border p-3">{p.apellido}</td>
                        <td className="border p-3">{p.cedula}</td>
                        <td className="border p-3">{p.telefono}</td>
                        <td className="border p-3">{p.email}</td>
                        <td className="border p-3">
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              onClick={() => handleEdit(p)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                              onClick={() => handleDelete(p._id)}
                              disabled={deletingId === p._id}
                            >
                              {deletingId === p._id ? "Eliminando..." : "Eliminar"}
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