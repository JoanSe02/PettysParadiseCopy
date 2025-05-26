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
  MdCalendarToday as IconCalendar,
  MdAssignment as IconAssignment,
} from "react-icons/md"
import "../stylos/Usu.css"

const VeterinarioDashboard = () => {
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
            <span className="user-role">Veterinario</span>
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li className={window.location.pathname === "/veterinario" ? "active" : ""}>
              <Link to="/veterinario">
                <IconDashboard /> Dashboard
              </Link>
            </li>
            <li className={window.location.pathname.includes("/veterinario/citas") ? "active" : ""}>
              <Link to="/veterinario/citas">
                <IconCalendar /> Mis Citas
              </Link>
            </li>
            <li className={window.location.pathname.includes("/veterinario/pacientes") ? "active" : ""}>
              <Link to="/veterinario/pacientes">
                <IconPaw /> Mis Pacientes
              </Link>
            </li>
            <li className={window.location.pathname.includes("/veterinario/historiales") ? "active" : ""}>
              <Link to="/veterinario/historiales">
                <IconAssignment /> Historiales Médicos
              </Link>
            </li>
            <li className={window.location.pathname.includes("/veterinario/configuracion") ? "active" : ""}>
              <Link to="/veterinario/configuracion">
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
            {window.location.pathname === "/veterinario"
              ? "Dashboard Veterinario"
              : window.location.pathname.includes("/veterinario/citas")
                ? "Mis Citas"
                : window.location.pathname.includes("/veterinario/pacientes")
                  ? "Mis Pacientes"
                  : window.location.pathname.includes("/veterinario/historiales")
                    ? "Historiales Médicos"
                    : window.location.pathname.includes("/veterinario/configuracion")
                      ? "Configuración"
                      : "Dashboard"}
          </h1>
          <div className="header-actions">
            <button className="notification-btn">
              <IconBell />
              <span className="badge">5</span>
            </button>
          </div>
        </header>

        <main className="content-body">
          <Outlet />

          {window.location.pathname === "/veterinario" && (
            <div className="dashboard-summary">
              <h2>Bienvenido, Dr. {userData.nombre}</h2>
              <p className="welcome-message">Este es tu panel de control como veterinario.</p>

              <div className="stats-container">
                <div className="stat-card">
                  <h3>Citas de Hoy</h3>
                  <p className="stat-value">{userData.todayAppointments || 0}</p>
                  <Link to="/veterinario/citas" className="card-link">
                    Ver agenda <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Pacientes Activos</h3>
                  <p className="stat-value">{userData.activePets || 0}</p>
                  <Link to="/veterinario/pacientes" className="card-link">
                    Ver pacientes <IconArrowRight />
                  </Link>
                </div>

                <div className="stat-card">
                  <h3>Historiales Pendientes</h3>
                  <p className="stat-value">{userData.pendingRecords || 0}</p>
                  <Link to="/veterinario/historiales" className="card-link">
                    Ver historiales <IconArrowRight />
                  </Link>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Acciones rápidas</h3>
                <div className="action-buttons">
                  <button className="action-btn">
                    <IconPlus /> Nueva consulta
                  </button>
                  <button className="action-btn">
                    <IconAssignment /> Crear historial
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

export default VeterinarioDashboard
