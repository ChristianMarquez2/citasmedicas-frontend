import api from "./http";

// Obtener todas las especialidades
export const getSpecialties = async () => {
  try {
    const { data } = await api.get("/specialties");
    return data;
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    throw error;
  }
};

// Crear nueva especialidad
export const createSpecialty = async (specialty) => {
  try {
    const { data } = await api.post("/specialties", specialty);
    return data;
  } catch (error) {
    console.error("Error al crear especialidad:", error);
    throw error;
  }
};

// Actualizar especialidad
export const updateSpecialty = async (id, specialty) => {
  try {
    const { data } = await api.put(`/specialties/${id}`, specialty);
    return data;
  } catch (error) {
    console.error(`Error al actualizar especialidad con id ${id}:`, error);
    throw error;
  }
};

// Eliminar especialidad
export const deleteSpecialty = async (id) => {
  try {
    const { data } = await api.delete(`/specialties/${id}`);
    return data; // opcional, depende de lo que devuelva tu API
  } catch (error) {
    console.error(`Error al eliminar especialidad con id ${id}:`, error);
    throw error;
  }
};
