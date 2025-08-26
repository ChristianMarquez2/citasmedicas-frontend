import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `nav-link d-block px-3 py-2 mb-1 rounded ${
      isActive
        ? "bg-primary text-white"
        : "text-dark text-decoration-none hover-bg-light"
    }`;

  return (
    <aside
      className="bg-white shadow-sm border-end d-flex flex-column vh-100"
      style={{ width: 220 }}
    >
      <div className="p-3 mb-4 border-bottom">
        <NavLink to="/Dashboard" className="fs-5 fw-bold text-decoration-none text-dark">
          Citas Médicas
        </NavLink>
      </div>
      <nav className="flex-grow-1 overflow-auto d-flex flex-column px-2">
        <NavLink to="/patients" className={linkClass}>
          Pacientes
        </NavLink>
        <NavLink to="/specialties" className={linkClass}>
          Especialidades
        </NavLink>
        <NavLink to="/appointments" className={linkClass}>
          Citas
        </NavLink>
        {/* Más links si los necesitas */}
      </nav>
    </aside>
  );
}
