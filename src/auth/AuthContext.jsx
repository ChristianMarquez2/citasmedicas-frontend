import { createContext, useState, useEffect, useCallback } from "react";
import { login as loginRequest, getProfile } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función de login CORREGIDA
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Hacer login para obtener el token
      const { token: newToken } = await loginRequest(credentials); 
      // ^^^ Asumo que tu backend devuelve { token } en el login.
      // Si devuelve { accessToken }, cambia esto por `const { accessToken: newToken } = ...`

      // 2. Guardar el token en estado y localStorage
      setToken(newToken);
      localStorage.setItem("token", newToken);

      // 3. ¡CRÍTICO! Usar el token nuevo para obtener el perfil REAL del usuario
      // desde el endpoint protegido /auth/me
      const userProfile = await getProfile(); // <-- Esta llamada ahora usará el token nuevo en el header
      setUser(userProfile);

    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      // Si falla el login o el getProfile, limpiamos el token por si acaso
      localStorage.removeItem("token");
      setToken(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión (ESTA BIEN)
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Validar perfil cuando la app se carga (ESTA BIEN)
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (isMounted) setUser(profile);
      } catch (error) {
        console.error("Error al validar token:", error);
        if (isMounted) logout(); // Limpia todo si el token es inválido
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => { isMounted = false; };
  }, [token, logout]);


  // Listener para logout desde BroadcastChannel (ESTA BIEN)
  useEffect(() => {
    const authChannel = new BroadcastChannel("auth");
    const handleLogoutMessage = (event) => {
      if (event.data === "logout") {
        logout();
      }
    };
    authChannel.addEventListener("message", handleLogoutMessage);

    return () => {
      authChannel.removeEventListener("message", handleLogoutMessage);
      authChannel.close();
    };
  }, [logout]);

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};