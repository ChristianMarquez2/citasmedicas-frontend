import { Navigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/Dashboard" replace />;

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
