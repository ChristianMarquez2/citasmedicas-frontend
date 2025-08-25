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
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private */}
      <Route
        path="/"
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
