import http from './http';

// Obtener todas las citas
export const getAppointments = async () => {
  const response = await http.get('/appointments');
  return response.data;
};

// Crear nueva cita
export const createAppointment = async (appointment) => {
  const response = await http.post('/appointments', appointment);
  return response.data;
};

// Actualizar cita
export const updateAppointment = async (id, appointment) => {
  const response = await http.put(`/appointments/${id}`, appointment);
  return response.data;
};

// Eliminar cita
export const deleteAppointment = async (id) => {
  const response = await http.delete(`/appointments/${id}`);
  return response.data; // opcional, depende de lo que devuelva tu API
};

// Obtener cita por ID
export const getAppointmentById = async (id) => {
  const response = await http.get(`/appointments/${id}`);
  return response.data;
};

// Obtener citas por usuario
export const getAppointmentsByUser = async (userId) => {
  const response = await http.get(`/appointments/user/${userId}`);
  return response.data;
};

// Obtener citas por fecha
export const getAppointmentsByDate = async (date) => {
  const response = await http.get(`/appointments/date/${date}`);
  return response.data;
};
