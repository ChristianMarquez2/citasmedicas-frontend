import { useState } from "react";
import { createSpecialty, updateSpecialty } from "../../api/specialties.api.js";
import { useToast } from "../../hooks/useToast.jsx";
import "../styles/SpecialtyForm.css"; // Importamos los estilos CSS

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
        showToast("Especialidad actualizada correctamente", "success");
      } else {
        await createSpecialty(payload);
        showToast("Especialidad creada correctamente", "success");
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || "Error guardando especialidad", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="specialty-form-overlay">
      <form onSubmit={handleSubmit} className="specialty-form">
        <div className="form-header">
          <h2>
            <i className="fas fa-stethoscope"></i>
            {specialty ? "Editar Especialidad" : "Nueva Especialidad"}
          </h2>
          <button type="button" className="btn-close-form" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="codigo">Código</label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="form-input"
            placeholder="Ej: CAR001"
            required
          />
          <small className="input-help">2-10 caracteres alfanuméricos</small>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
            placeholder="Ej: Cardiología"
            required
          />
          <small className="input-help">Mínimo 2 caracteres</small>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-textarea"
            placeholder="Describa la especialidad médica..."
            rows="3"
            required
          />
          <small className="input-help">Mínimo 5 caracteres</small>
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
                Guardar
              </>
            )}
          </button>
        </div>

        <Toast />
      </form>
    </div>
  );
}