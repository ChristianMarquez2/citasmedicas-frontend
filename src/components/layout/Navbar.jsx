import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="navbar navbar-expand bg-white shadow px-4 py-3">
      <span className="navbar-brand h1 mb-0">Citas Médicas</span>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-secondary">Hola, {user?.user?.nombre || "Usuario"}</span>
        <button
          onClick={logout}
          className="btn btn-danger"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}