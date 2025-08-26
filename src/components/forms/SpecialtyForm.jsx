import { useState } from "react";
import { createSpecialty, updateSpecialty } from "../../api/specialties.api.js";
import { useToast } from "../../hooks/useToast.jsx";

export default function SpecialtyForm({ specialty, onClose, onSaved }) {
  const [codigo, setCodigo] = useState(specialty?.codigo || "");
  const [nombre, setNombre] = useState(specialty?.nombre || "");
  const [descripcion, setDescripcion] = useState(specialty?.descripcion || "");

  const { showToast, Toast } = useToast();

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // Validaciones
    if (!/^[A-Za-z0-9]{2,10}$/.test(codigo)) {
      showToast("El código debe tener entre 2 y 10 caracteres alfanuméricos", "error");
      return;
    }

    if (nombre.trim().length < 2) {
      showToast("El nombre debe tener al menos 2 caracteres", "error");
      return;
    }

    if (descripcion.trim().length < 5) {
      showToast("La descripción debe tener al menos 5 caracteres", "error");
      return;
    }

    const payload = { codigo, nombre, descripcion };
    setSaving(true);

    try {
      if (specialty) {
        await updateSpecialty(specialty._id, payload);
        showToast("Especialidad actualizada", "success");
      } else {
        await createSpecialty(payload);
        showToast("Especialidad creada", "success");
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast("Error guardando especialidad", "error");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.3)", zIndex: 1050 }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: 400 }}
      >
        <h2 className="h5 mb-4">{specialty ? "Editar Especialidad" : "Nueva Especialidad"}</h2>

        <div className="mb-3">
          <label className="form-label">Código</label>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={onClose}
          >
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