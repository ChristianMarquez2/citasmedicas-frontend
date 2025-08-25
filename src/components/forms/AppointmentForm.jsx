import { useState } from "react";
import { createAppointment, updateAppointment } from "../../api/appointments.api.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function AppointmentForm({ appointment, onClose, onSaved, patients, specialties }) {
  const [codigo, setCodigo] = useState(appointment?.codigo || "");
  const [descripcion, setDescripcion] = useState(appointment?.descripcion || "");
  const [idPaciente, setIdPaciente] = useState(appointment?.id_paciente || "");
  const [idEspecialidad, setIdEspecialidad] = useState(appointment?.id_especialidad || "");
  const [fecha, setFecha] = useState(appointment?.fecha ? appointment.fecha.substring(0,16) : "");
  const { showToast, Toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { codigo, descripcion, id_paciente: idPaciente, id_especialidad: idEspecialidad, fecha };

    try {
      if (appointment) {
        await updateAppointment(appointment._id, payload);
        showToast("Cita actualizada", "success");
      } else {
        await createAppointment(payload);
        showToast("Cita creada", "success");
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast("Error guardando cita", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl mb-4">{appointment ? "Editar Cita" : "Nueva Cita"}</h2>

        <div className="mb-2">
          <label className="block mb-1">Código</label>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full border px-2 py-1" required/>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Descripción</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border px-2 py-1" required/>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Paciente</label>
          <select value={idPaciente} onChange={(e) => setIdPaciente(e.target.value)} className="w-full border px-2 py-1" required>
            <option value="">-- Seleccione un paciente --</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Especialidad</label>
          <select value={idEspecialidad} onChange={(e) => setIdEspecialidad(e.target.value)} className="w-full border px-2 py-1" required>
            <option value="">-- Seleccione una especialidad --</option>
            {specialties.map(s => (
              <option key={s._id} value={s._id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Fecha y hora</label>
          <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border px-2 py-1" required/>
        </div>

        <div className="flex justify-end mt-4">
          <button type="button" className="mr-2 px-4 py-2 border rounded" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>

        <Toast />
      </form>
    </div>
  );
}
