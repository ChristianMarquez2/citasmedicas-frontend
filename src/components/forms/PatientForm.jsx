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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre, apellido, cedula, fecha_nacimiento, genero,
      ciudad, direccion, telefono, email
    };

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
      showToast("Error guardando paciente", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl mb-4">{patient ? "Editar Paciente" : "Nuevo Paciente"}</h2>

        {[
          { label: "Nombre", value: nombre, setter: setNombre },
          { label: "Apellido", value: apellido, setter: setApellido },
          { label: "Cédula", value: cedula, setter: setCedula },
          { label: "Fecha de Nacimiento", value: fecha_nacimiento, setter: setFechaNacimiento, type: "date" },
          { label: "Género", value: genero, setter: setGenero },
          { label: "Ciudad", value: ciudad, setter: setCiudad },
          { label: "Dirección", value: direccion, setter: setDireccion },
          { label: "Teléfono", value: telefono, setter: setTelefono },
          { label: "Email", value: email, setter: setEmail, type: "email" },
        ].map((field, i) => (
          <div className="mb-2" key={i}>
            <label className="block mb-1">{field.label}</label>
            <input
              type={field.type || "text"}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="w-full border px-2 py-1"
              required
            />
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-2 px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Guardar
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}
