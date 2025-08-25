import { Navigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
