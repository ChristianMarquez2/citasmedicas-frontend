import { useState } from "react";
import { createAppointment, updateAppointment } from "../../api/appointments.api.js";
import { useToast } from "../../hooks/useToast.jsx";
import "../styles/AppointmentForm.css"; // Importamos los estilos CSS

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

    // --- Validaciones ---
    const codigoNum = parseInt(codigo);

    // Código: obligatorio, numérico, positivo, máx. 6 dígitos
    if (!codigo || isNaN(codigoNum) || codigoNum <= 0) {
      showToast("El código debe ser un número positivo", "error");
      return;
    }
    if (codigo.toString().length > 6) {
      showToast("El código no puede superar los 6 dígitos", "error");
      return;
    }

    // Descripción: obligatorio, entre 5 y 200 caracteres
    const descripcionTrim = descripcion.trim();
    if (!descripcionTrim || descripcionTrim.length < 5) {
      showToast("La descripción debe tener al menos 5 caracteres", "error");
      return;
    }
    if (descripcionTrim.length > 200) {
      showToast("La descripción no puede superar los 200 caracteres", "error");
      return;
    }

    // Selección de paciente y especialidad
    if (!idPaciente) {
      showToast("Debe seleccionar un paciente", "error");
      return;
    }
    if (!idEspecialidad) {
      showToast("Debe seleccionar una especialidad", "error");
      return;
    }

    // Fecha: válida y en el futuro
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      showToast("Fecha inválida", "error");
      return;
    }
    if (fechaDate < new Date()) {
      showToast("La fecha y hora no pueden ser en el pasado", "error");
      return;
    }

    // --- Payload listo ---
    const payload = {
      codigo: codigoNum,
      descripcion: descripcionTrim,
      id_paciente: idPaciente,
      id_especialidad: idEspecialidad,
      fecha: fechaDate.toISOString(),
    };

    setSaving(true);
    try {
      if (appointment) {
        await updateAppointment(appointment._id, payload);
        showToast("Cita actualizada correctamente", "success");
      } else {
        await createAppointment(payload);
        showToast("Cita creada correctamente", "success");
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
    {
      label: "Código",
      value: codigo,
      setter: setCodigo,
      type: "number",
      placeholder: "Ingrese el código",
      required: true,
      help: "Debe ser un número positivo (máx. 6 dígitos)",
      maxLength: 6, // 👈
      min: 1        // 👈 asegura que no sea negativo ni cero
    },
    {
      label: "Descripción",
      value: descripcion,
      setter: setDescripcion,
      placeholder: "Ingrese la descripción de la cita",
      required: true,
      type: "textarea",
      help: "Entre 5 y 200 caracteres",
      maxLength: 200 // 👈
    },
    {
      label: "Fecha y Hora",
      value: fecha,
      setter: setFecha,
      type: "datetime-local",
      required: true
    },
  ];


  return (
    <div className="appointment-form-overlay">
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-header">
          <h2>
            <i className="fas fa-calendar-check"></i>
            {appointment ? "Editar Cita" : "Nueva Cita"}
          </h2>
          <button type="button" className="btn-close-form" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="form-content">
          {fields.map((field, index) => (
            <div className="form-group" key={index}>
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="form-textarea"
                  placeholder={field.placeholder}
                  rows="3"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="form-input"
                  placeholder={field.placeholder}
                  required={field.required}
                  maxLength={field.maxLength || undefined} // 👈 aplica si existe
                  min={field.min || undefined}             // 👈 aplica si existe
                />

              )}

              {field.help && (
                <small className="input-help">{field.help}</small>
              )}
            </div>
          ))}

          <div className="form-group">
            <label>
              Paciente
              <span className="required">*</span>
            </label>
            <select
              value={idPaciente}
              onChange={(e) => setIdPaciente(e.target.value)}
              className="form-input"
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

          <div className="form-group">
            <label>
              Especialidad
              <span className="required">*</span>
            </label>
            <select
              value={idEspecialidad}
              onChange={(e) => setIdEspecialidad(e.target.value)}
              className="form-input"
              required
            >
              <option value="">-- Seleccione una especialidad --</option>
              {specialties && Array.isArray(specialties) && specialties.map(s => (
                <option key={s._id} value={s._id}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-small"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {appointment ? "Actualizar" : "Crear"} Cita
              </>
            )}
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}