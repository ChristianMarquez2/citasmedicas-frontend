import api from "./http";

// Obtener todos los pacientes
export const getPatients = async () => {
  try {
    const { data } = await api.get("/patients");
    return data;
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    throw error;
  }
};

// Crear un nuevo paciente
export const createPatient = async (patient) => {
  try {
    const { data } = await api.post("/patients", patient);
    return data;
  } catch (error) {
    console.error("Error al crear paciente:", error);
    throw error;
  }
};

// Actualizar paciente
export const updatePatient = async (id, patient) => {
  try {
    const { data } = await api.put(`/patients/${id}`, patient);
    return data;
  } catch (error) {
    console.error(`Error al actualizar paciente con id ${id}:`, error);
    throw error;
  }
};

// Eliminar paciente
export const deletePatient = async (id) => {
  try {
    const { data } = await api.delete(`/patients/${id}`);
    return data; // opcional, depende de lo que devuelva tu API
  } catch (error) {
    console.error(`Error al eliminar paciente con id ${id}:`, error);
    throw error;
  }
};
// Obtener paciente por ID
export const getPatientById = async (id) => { 
  try {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener paciente con id ${id}:`, error);
    throw error;
  }
}
