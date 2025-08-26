import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div className="layout">
        <Sidebar />
        <div className="d-flex flex-column flex-grow-1 overflow-hidden main-content">
          <Navbar />
          <main className="flex-grow-1 p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}