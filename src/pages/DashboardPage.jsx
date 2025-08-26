import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = `Dashboard - ${user?.user?.nombre || "Usuario"}`;
  }, [user]);

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <p className="text-secondary fs-5">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="p-4 flex-grow-1">
          <h1 className="fs-3 fw-bold mb-4">
            Bienvenido, {user?.user?.nombre || "Usuario"}
          </h1>

          {/* Contenido del dashboard */}
          <div className="row g-4">
            {/* Ejemplo de tarjetas */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="fw-semibold">Pacientes</h2>
                <p className="text-secondary">Total de pacientes: 0</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="fw-semibold">Citas</h2>
                <p className="text-secondary">Total de citas: 0</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="fw-semibold">Especialidades</h2>
                <p className="text-secondary">Total de especialidades: 0</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}