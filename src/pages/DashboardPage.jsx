import { useAuth } from "../auth/useAuth";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold">
            Bienvenido, {user?.name || "Usuario"}
          </h1>
        </div>
      </div>
    </div>
  );
}
