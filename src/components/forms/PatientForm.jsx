import { useState } from "react";
import { createPatient, updatePatient } from "../../api/patients.api.js";
import { useToast } from "../../hooks/useToast.jsx";
import "../styles/PatientForm.css"; // Importamos los estilos CSS

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

    const payload = { 
      nombre, 
      apellido, 
      cedula, 
      fecha_nacimiento, 
      genero, 
      ciudad, 
      direccion, 
      telefono, 
      email 
    };

    setSaving(true);
    try {
      if (patient) {
        await updatePatient(patient._id, payload);
        showToast("Paciente actualizado correctamente", "success");
      } else {
        await createPatient(payload);
        showToast("Paciente creado correctamente", "success");
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
    { 
      label: "Nombre", 
      value: nombre, 
      setter: setNombre, 
      placeholder: "Ingrese el nombre",
      required: true
    },
    { 
      label: "Apellido", 
      value: apellido, 
      setter: setApellido, 
      placeholder: "Ingrese el apellido",
      required: true
    },
    { 
      label: "Cédula", 
      value: cedula, 
      setter: setCedula, 
      placeholder: "Ej: 1234567890",
      required: true,
      pattern: "\\d{10}",
      help: "10 dígitos sin espacios ni guiones"
    },
    { 
      label: "Fecha de Nacimiento", 
      value: fecha_nacimiento, 
      setter: setFechaNacimiento, 
      type: "date",
      required: true
    },
    { 
      label: "Género", 
      value: genero, 
      setter: setGenero, 
      type: "select",
      options: ["", "Masculino", "Femenino", "Otro"],
      placeholder: "Seleccione el género"
    },
    { 
      label: "Ciudad", 
      value: ciudad, 
      setter: setCiudad, 
      placeholder: "Ingrese la ciudad"
    },
    { 
      label: "Dirección", 
      value: direccion, 
      setter: setDireccion, 
      placeholder: "Ingrese la dirección completa",
      type: "textarea"
    },
    { 
      label: "Teléfono", 
      value: telefono, 
      setter: setTelefono, 
      placeholder: "Ej: 0987654321",
      pattern: "\\d{7,15}",
      help: "7-15 dígitos sin espacios ni guiones"
    },
    { 
      label: "Email", 
      value: email, 
      setter: setEmail, 
      type: "email",
      placeholder: "ejemplo@correo.com"
    },
  ];

  return (
    <div className="patient-form-overlay">
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-header">
          <h2>
            <i className="fas fa-user-injured"></i>
            {patient ? "Editar Paciente" : "Nuevo Paciente"}
          </h2>
          <button type="button" className="btn-close-form" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="form-grid">
          {fields.map((field, index) => (
            <div className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`} key={index}>
              <label htmlFor={field.label.toLowerCase().replace(/\s+/g, '-')}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  id={field.label.toLowerCase().replace(/\s+/g, '-')}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="form-input"
                  required={field.required}
                >
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option || field.placeholder}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.label.toLowerCase().replace(/\s+/g, '-')}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="form-textarea"
                  placeholder={field.placeholder}
                  rows="3"
                  required={field.required}
                />
              ) : (
                <input
                  id={field.label.toLowerCase().replace(/\s+/g, '-')}
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="form-input"
                  placeholder={field.placeholder}
                  pattern={field.pattern}
                  required={field.required}
                />
              )}
              
              {field.help && (
                <small className="input-help">{field.help}</small>
              )}
            </div>
          ))}
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
                {patient ? "Actualizar" : "Crear"} Paciente
              </>
            )}
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}