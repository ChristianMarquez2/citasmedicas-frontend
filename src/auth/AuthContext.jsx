import { createContext, useState, useEffect } from "react";
import { login as loginRequest, getProfile } from "../api/auth.api";

// Crear contexto
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Al montar, si hay token → validar perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Error al validar token:", error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // Iniciar sesión
  const login = async (credentials) => {
    const { token, user } = await loginRequest(credentials);
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
