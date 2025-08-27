import axios from "axios";

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: import.meta.env.VITE_API_URL,

  headers: { "Content-Type": "application/json" },
});

// Crear un canal de eventos para logout
export const authChannel = new BroadcastChannel("auth");

// Cerrar el canal al salir (opcional, para evitar fugas de recursos en pestañas cerradas)
window.addEventListener("beforeunload", () => {
  authChannel.close();
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Validar que el token no sea null, vacío o "undefined"
    if (token && token !== "undefined" && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401: // No autorizado → limpiar sesión
          localStorage.removeItem("token");
          authChannel.postMessage("logout");
          break;
        case 403: // Prohibido → no tienes permisos
          console.warn("Acceso prohibido: no tienes permisos para esta acción.");
          break;
        case 500: // Error interno del servidor
          console.error("Error del servidor. Intenta de nuevo más tarde.");
          break;
        default:
          console.error("Error inesperado:", error.response);
      }
    } else {
      console.error("Error sin respuesta del servidor:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
    