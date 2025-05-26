"use client"
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

const AdministradorDashboard = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  })

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user) {
        setUserData({
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          email: user.email || "",
        })
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error)
    }
  }, [])

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
              <button
                onClick={() => {
                  if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    localStorage.removeItem("user")
                    localStorage.removeItem("token")
                    window.location.href = "/"
                  }
                }}
                className="logout-button"
              >
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

              <div className="stats-container">
                <div className="stat-card">
                  <h3>Total Usuarios</h3>
                  <p className="stat-value">{userData.totalUsers || 0}</p>
                  <Link to="/administrador/usuarios" className="card-link">
                    Ver usuarios <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Veterinarios Activos</h3>
                  <p className="stat-value">{userData.totalVets || 0}</p>
                  <Link to="/administrador/veterinarios" className="card-link">
                    Ver veterinarios <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Total Mascotas</h3>
                  <p className="stat-value">{userData.totalPets || 0}</p>
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
