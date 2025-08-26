import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import * as authApi from "../../api/auth.api";
import { useToast } from "../../hooks/useToast.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await login({ email, password });
      showToast("Inicio de sesión exitoso", "success");
      navigate("/"); // redirige al dashboard
    } catch (error) {
      showToast(error.response?.data?.message || "Error al iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card shadow-sm p-4"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-100"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <Toast />
    </form>
  );
};

export default LoginForm;
