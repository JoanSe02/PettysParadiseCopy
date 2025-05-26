import { Link, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  MdEmail as IconMail,
  MdDashboard as IconDashboard,
  MdPets as IconPaw,
  MdSettings as IconSettings,
  MdLogout as IconLogout,
  MdNotifications as IconBell,
  MdArrowForward as IconArrowRight,
  MdAdd as IconPlus,
  MdPeople as IconPeople,
  MdLocalHospital as IconHospital,
} from "react-icons/md"
import "../stylos/Usu.css"
import { apiService } from "../services/api-service"

const AdministradorDashboard = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    totalUsers: 0,
    totalVets: 0,
    totalPets: 0,
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Cargar datos del usuario desde localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (user) {
          setUserData(prevState => ({
            ...prevState,
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            email: user.email || "",
          }))
        }

        // Cargar estadísticas desde el servidor
        const [usersCount, vetsCount, petsCount] = await Promise.all([
          apiService.get("/api/admin/users/count"),
          apiService.get("/api/admin/vets/count"),
          apiService.get("/api/admin/pets/count")
        ])

        setUserData(prevState => ({
          ...prevState,
          totalUsers: usersCount.total || 0,
          totalVets: vetsCount.total || 0,
          totalPets: petsCount.total || 0,
        }))
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      window.location.href = "/"
    }
  }

  return (
    <div className="administrador-dashboard">
      <div className="sidebar">
        <div className="user-info">
          <div className="avatar">
            {userData.nombre.charAt(0).toUpperCase()}
            {userData.apellido.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3 className="user-name">
              {userData.nombre} {userData.apellido}
            </h3>
            <p className="user-email">
              <IconMail size={16} /> {userData.email}
            </p>
            <span className="user-role">Administrador</span>
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li className={window.location.pathname === "/administrador" ? "active" : ""}>
              <Link to="/administrador">
                <IconDashboard /> Dashboard
              </Link>
            </li>
            <li className={window.location.pathname.includes("/administrador/usuarios") ? "active" : ""}>
              <Link to="/administrador/usuarios">
                <IconPeople /> Gestionar Usuarios
              </Link>
            </li>
            <li className={window.location.pathname.includes("/administrador/veterinarios") ? "active" : ""}>
              <Link to="/administrador/veterinarios">
                <IconHospital /> Gestionar Veterinarios
              </Link>
            </li>
            <li className={window.location.pathname.includes("/administrador/mascotas") ? "active" : ""}>
              <Link to="/administrador/mascotas">
                <IconPaw /> Todas las Mascotas
              </Link>
            </li>
            <li className={window.location.pathname.includes("/administrador/configuracion") ? "active" : ""}>
              <Link to="/administrador/configuracion">
                <IconSettings /> Configuración
              </Link>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="logout-button">
                <IconLogout /> Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <header className="content-header">
          <h1>
            {window.location.pathname === "/administrador"
              ? "Dashboard Administrador"
              : window.location.pathname.includes("/administrador/usuarios")
                ? "Gestionar Usuarios"
                : window.location.pathname.includes("/administrador/veterinarios")
                  ? "Gestionar Veterinarios"
                  : window.location.pathname.includes("/administrador/mascotas")
                    ? "Todas las Mascotas"
                    : window.location.pathname.includes("/administrador/configuracion")
                      ? "Configuración"
                      : "Dashboard"}
          </h1>
          <div className="header-actions">
            <button className="notification-btn">
              <IconBell />
              <span className="badge">3</span>
            </button>
          </div>
        </header>

        <main className="content-body">
          <Outlet />

          {window.location.pathname === "/administrador" && (
            <div className="dashboard-summary">
              <h2>Bienvenido, {userData.nombre}</h2>
              <p className="welcome-message">Este es tu panel de control como administrador.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Usuarios</h3>
                  <p className="stat-value">{userData.totalUsers}</p>
                  <Link to="/administrador/usuarios" className="card-link">
                    Ver usuarios <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Veterinarios Activos</h3>
                  <p className="stat-value">{userData.totalVets}</p>
                  <Link to="/administrador/veterinarios" className="card-link">
                    Ver veterinarios <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Total Mascotas</h3>
                  <p className="stat-value">{userData.totalPets}</p>
                  <Link to="/administrador/mascotas" className="card-link">
                    Ver mascotas <IconArrowRight />
                  </Link>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Acciones rápidas</h3>
                <div className="action-buttons">
                  <button className="action-btn">
                    <IconPlus /> Crear nuevo usuario
                  </button>
                  <button className="action-btn">
                    <IconHospital /> Registrar veterinario
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdministradorDashboard