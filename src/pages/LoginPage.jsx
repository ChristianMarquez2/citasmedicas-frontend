import { Navigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { useAuth } from "../hooks/useAuth";
import "../styles/LoginPage.css"; // Importamos el archivo CSS

const LoginPage = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/Dashboard" replace />;

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="medical-icon">
              <i className="fas fa-stethoscope"></i>
            </div>
            <h1>Sistema de Gestión Médica</h1>
            <p>Ingrese a su cuenta para continuar</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;