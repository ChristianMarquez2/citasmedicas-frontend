import api from "./http";

export const getPatients = async () => {
  const { data } = await api.get("/patients");
  return data;
};

export const createPatient = async (patient) => {
  const { data } = await api.post("/patients", patient);
  return data;
};

export const updatePatient = async (id, patient) => {
  const { data } = await api.put(`/patients/${id}`, patient);
  return data;
};

export const deletePatient = async (id) => {
  await api.delete(`/patients/${id}`);
};
