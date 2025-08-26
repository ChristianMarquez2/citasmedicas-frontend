import { useState } from "react";
import { createPatient, updatePatient } from "../../api/patients.api.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function PatientForm({ patient, onClose, onSaved }) {
  const [nombre, setNombre] = useState(patient?.nombre || "");
  const [apellido, setApellido] = useState(patient?.apellido || "");
  const [cedula, setCedula] = useState(patient?.cedula || "");
  const [fecha_nacimiento, setFechaNacimiento] = useState(patient?.fecha_nacimiento || "");
  const [genero, setGenero] = useState(patient?.genero || "");
  const [ciudad, setCiudad] = useState(patient?.ciudad || "");
  const [direccion, setDireccion] = useState(patient?.direccion || "");
  const [telefono, setTelefono] = useState(patient?.telefono || "");
  const [email, setEmail] = useState(patient?.email || "");

  const { showToast, Toast } = useToast();

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // Validaciones personalizadas
    if (nombre.trim().length < 2) {
      showToast("El nombre debe tener al menos 2 caracteres", "error");
      return;
    }

    if (!/^\d{10}$/.test(cedula)) {
      showToast("La cédula debe tener 10 dígitos", "error");
      return;
    }

    if (telefono && !/^\d{7,15}$/.test(telefono)) {
      showToast("El teléfono debe tener entre 7 y 15 dígitos", "error");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Email no válido", "error");
      return;
    }

    const payload = { nombre, apellido, cedula, fecha_nacimiento, genero, ciudad, direccion, telefono, email };

    setSaving(true);
    try {
      if (patient) {
        await updatePatient(patient._id, payload);
        showToast("Paciente actualizado", "success");
      } else {
        await createPatient(payload);
        showToast("Paciente creado", "success");
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || "Error guardando paciente", "error");
    } finally {
      setSaving(false);
    }
  };


  const fields = [
    { label: "Nombre", value: nombre, setter: setNombre },
    { label: "Apellido", value: apellido, setter: setApellido },
    { label: "Cédula", value: cedula, setter: setCedula },
    { label: "Fecha de Nacimiento", value: fecha_nacimiento, setter: setFechaNacimiento, type: "date" },
    { label: "Género", value: genero, setter: setGenero },
    { label: "Ciudad", value: ciudad, setter: setCiudad },
    { label: "Dirección", value: direccion, setter: setDireccion },
    { label: "Teléfono", value: telefono, setter: setTelefono },
    { label: "Email", value: email, setter: setEmail, type: "email" },
  ];

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.3)", zIndex: 1050 }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: 400, maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 className="h5 mb-4">{patient ? "Editar Paciente" : "Nuevo Paciente"}</h2>

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

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}