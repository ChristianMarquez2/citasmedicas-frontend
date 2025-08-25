import api from "./http";

// Obtener todas las especialidades
export const getSpecialties = async () => {
  const { data } = await api.get("/specialties");
  return data;
};

// Crear nueva especialidad
export const createSpecialty = async (specialty) => {
  const { data } = await api.post("/specialties", specialty);
  return data;
};

// Actualizar especialidad
export const updateSpecialty = async (id, specialty) => {
  const { data } = await api.put(`/specialties/${id}`, specialty);
  return data;
};

// Eliminar especialidad
export const deleteSpecialty = async (id) => {
  await api.delete(`/specialties/${id}`);
};
