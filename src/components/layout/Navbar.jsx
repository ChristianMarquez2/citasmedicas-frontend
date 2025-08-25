import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-xl font-bold">Citas Médicas</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hola, {user?.name || "Usuario"}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
