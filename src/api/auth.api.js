import api from "./http";

// Login → devuelve token y usuario
export const login = async (credentials) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    // Aseguramos que solo retornamos lo necesario
    const { token, user } = data;
    return { token, user };
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data; // Aquí devuelves todo el perfil que el backend entregue
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};
