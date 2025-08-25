import api from "./http";

// Obtener todas las citas
export const getAppointments = async () => {
  const { data } = await api.get("/appointments");
  return data;
};

// Crear nueva cita
export const createAppointment = async (appointment) => {
  const { data } = await api.post("/appointments", appointment);
  return data;
};

// Actualizar cita
export const updateAppointment = async (id, appointment) => {
  const { data } = await api.put(`/appointments/${id}`, appointment);
  return data;
};

// Eliminar cita
export const deleteAppointment = async (id) => {
  await api.delete(`/appointments/${id}`);
};
