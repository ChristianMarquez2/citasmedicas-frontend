import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import SpecialtiesPage from "./pages/SpecialtiesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Redirigir la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <PatientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/specialties"
        element={
          <PrivateRoute>
            <SpecialtiesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        }
      />

      {/* Página 404 */}
      <Route
        path="*"
        element={
          <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="text-center">
              <h1 className="display-4 fw-bold text-danger">404</h1>
              <p className="lead">Página no encontrada</p>
              <a href="/" className="btn btn-primary">
                Ir al inicio
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
