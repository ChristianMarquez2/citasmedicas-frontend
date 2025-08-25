import api from "./http";

// Login → devuelve token y usuario
export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data; // { token, user }
};

// Opcional: obtener perfil
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};
