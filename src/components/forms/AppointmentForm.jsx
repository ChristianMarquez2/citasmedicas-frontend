import { useState } from "react";
import { createAppointment, updateAppointment } from "../../api/appointments.api.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function AppointmentForm({ appointment, onClose, onSaved, patients, specialties }) {
  const [codigo, setCodigo] = useState(appointment?.codigo || "");
  const [descripcion, setDescripcion] = useState(appointment?.descripcion || "");
  const [idPaciente, setIdPaciente] = useState(appointment?.id_paciente?._id || appointment?.id_paciente || "");
  const [idEspecialidad, setIdEspecialidad] = useState(appointment?.id_especialidad?._id || appointment?.id_especialidad || "");
  const [fecha, setFecha] = useState(appointment?.fecha ? appointment.fecha.substring(0, 16) : "");
  const [saving, setSaving] = useState(false);

  const { showToast, Toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // Validaciones
    if (!codigo || parseInt(codigo) <= 0) {
      showToast("El código debe ser un número positivo", "error");
      return;
    }
    if (!descripcion || descripcion.trim().length < 5) {
      showToast("La descripción debe tener al menos 5 caracteres", "error");
      return;
    }
    if (!idPaciente) {
      showToast("Debe seleccionar un paciente", "error");
      return;
    }
    if (!idEspecialidad) {
      showToast("Debe seleccionar una especialidad", "error");
      return;
    }
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      showToast("Fecha inválida", "error");
      return;
    }
    if (fechaDate < new Date()) {
      showToast("La fecha y hora no pueden ser en el pasado", "error");
      return;
    }

    const payload = {
      codigo: parseInt(codigo),
      descripcion,
      id_paciente: idPaciente,
      id_especialidad: idEspecialidad,
      fecha: fechaDate.toISOString(),
    };

    setSaving(true);
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
      showToast(error.message || error.response?.data?.error || "Error al guardar cita", "error");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Código", value: codigo, setter: setCodigo, type: "number" },
    { label: "Descripción", value: descripcion, setter: setDescripcion },
    { label: "Fecha y hora", value: fecha, setter: setFecha, type: "datetime-local" },
  ];

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.3)", zIndex: 1050 }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: 400, maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 className="h5 mb-4">{appointment ? "Editar Cita" : "Nueva Cita"}</h2>

        {fields.map((field, i) => (
          <div className="mb-3" key={i}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type || "text"}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="form-control"
              required
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Paciente</label>
          <select
            value={idPaciente}
            onChange={(e) => setIdPaciente(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Seleccione un paciente --</option>
            {patients && Array.isArray(patients) && patients.length > 0 ? (
              patients.map(p => (
                <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
              ))
            ) : (
              <option value="" disabled>No hay pacientes disponibles</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Especialidad</label>
          <select
            value={idEspecialidad}
            onChange={(e) => setIdEspecialidad(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Seleccione una especialidad --</option>
            {specialties && Array.isArray(specialties) && specialties.map(s => (
              <option key={s._id} value={s._id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}
