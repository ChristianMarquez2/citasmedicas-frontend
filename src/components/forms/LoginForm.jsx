import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto bg-white shadow-md rounded p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
