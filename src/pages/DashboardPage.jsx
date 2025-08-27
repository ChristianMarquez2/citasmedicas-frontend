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
          {/* Contenido del dashboard */}
          <div className="row g-4">
            {/* Pacientes */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 bg-white shadow rounded">
                <h2 className="fw-semibold mb-3">Pacientes</h2>
                <div id="carouselPacientes" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner rounded">
                    <div className="carousel-item active">
                      <a href="patients">
                        <img src="https://img.freepik.com/vector-premium/paciente-cita-medico-concepto-consulta-medica-ilustracion-personajes-dibujos-animados-vectoriales_338371-1537.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Registrar Paciente" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Registrar un nuevo paciente en el sistema.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="patients">
                        <img src="https://www.shutterstock.com/image-vector/happy-pregnant-woman-doctors-appointment-600nw-2204184659.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Lista Pacientes" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Consultar la lista completa de pacientes.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="patients">
                        <img src="https://www.shutterstock.com/image-vector/doctor-do-examine-little-kid-600nw-2203220673.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Editar Paciente" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Actualizar información de pacientes.</div>
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselPacientes" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselPacientes" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Citas */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 bg-white shadow rounded">
                <h2 className="fw-semibold mb-3">Citas</h2>
                <div id="carouselCitas" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner rounded">
                    <div className="carousel-item active">
                      <a href="appointments">
                        <img src="https://static.vecteezy.com/system/resources/previews/015/316/843/non_2x/schedule-doctor-appointment-2d-isolated-linear-illustration-healthcare-thin-line-flat-character-on-cartoon-background-colorful-editable-scene-for-mobile-website-presentation-vector.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Agendar Cita" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Agendar nuevas citas médicas.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="appointments">
                        <img src="https://www.shutterstock.com/image-vector/friendly-male-doctor-near-calendar-260nw-1365928769.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Lista Citas" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Revisar citas pendientes y atendidas.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="appointments">
                        <img src="https://previews.123rf.com/images/ntlstudio/ntlstudio2210/ntlstudio221000037/192428685-schedule-doctor-appointment-2d-vector-isolated-illustration-health-care-service-flat-characters-on.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Cancelar Cita" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Cancelar o reprogramar citas existentes.</div>
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselCitas" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselCitas" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Especialidades */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 bg-white shadow rounded">
                <h2 className="fw-semibold mb-3">Especialidades</h2>
                <div id="carouselEspecialidades" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner rounded">
                    <div className="carousel-item active">
                      <a href="specialties">
                        <img src="https://media.istockphoto.com/id/1028847418/es/vector/visita-de-doctor-con-paciente-por-concepto-de-la-medicina.jpg?s=612x612&w=0&k=20&c=zx03ZHxDX4KPJ0WbjEJfutCtDdyb5pUovtFkP3X8snY="
                          className="d-block w-100 rounded img-carousel"
                          alt="Cardiología" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Gestión de la especialidad de Cardiología.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="specialties">
                        <img src="https://www.shutterstock.com/image-vector/doctor-flat-line-icons-editable-260nw-2333707065.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Pediatría" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Gestión de la especialidad de Pediatría.</div>
                    </div>
                    <div className="carousel-item">
                      <a href="specialties">
                        <img src="https://images.vexels.com/media/users/3/71936/raw/3509b4ce56a2fd2ed0206c07c74ffe2f-20-iconos-medicos-y-de-salud.jpg"
                          className="d-block w-100 rounded img-carousel"
                          alt="Odontología" />
                      </a>
                      <div className="mt-2 text-secondary small text-center">Gestión de la especialidad de Odontología.</div>
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselEspecialidades" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselEspecialidades" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>


        </main>
      </div>
    </div>
  );
}