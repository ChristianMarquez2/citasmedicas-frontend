import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
