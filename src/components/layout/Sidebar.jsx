import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/patients" className={linkClass}>
          Pacientes
        </NavLink>
        <NavLink to="/specialties" className={linkClass}>
          Especialidades
        </NavLink>
        <NavLink to="/appointments" className={linkClass}>
          Citas
        </NavLink>
      </nav>
    </aside>
  );
}
