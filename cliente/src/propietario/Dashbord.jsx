import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaPaw,
  FaBars,
  FaEnvelope,
  FaThLarge,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaHome
} from "react-icons/fa";
import '../stylos/Dashbord.css';

export default function Dashboard() {
    const [userData, setUserData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        role: "Administrador"
    });
    
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("inicio");
    
    const logout = () => {
        if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    };
    
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user) {
                setUserData({
                    nombre: user.nombre || "",
                    apellido: user.apellido || "",
                    email: user.email || "",
                    role: user.role || "Administrador",
                    petsCount: user.petsCount || 0,
                    upcomingAppointments: user.upcomingAppointments || 0,
                    remindersCount: user.remindersCount || 0,
                });
            }
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        }
    }, []);
    
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleNavClick = (item) => {
        setActiveItem(item);
    };

    return (
        <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <FaChartLine />
                        <span>DashBoard</span>
                    </div>
                    <button className="mobile-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>

                <div className="user-profile">
                    <div className="avatar">
                        {userData.nombre.charAt(0).toUpperCase()}
                        {userData.apellido.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h3>{`${userData.nombre} ${userData.apellido}`}</h3>
                        <p><FaEnvelope /> {userData.email}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className={activeItem === "inicio" ? "active" : ""}>
                            <Link 
                                to="/propietario" 
                                onClick={() => handleNavClick("inicio")}
                            >
                                <FaHome />
                                <span>Inicio</span>
                            </Link>
                        </li>
                        
                        <li className={activeItem === "mascotas" ? "active" : ""}>
                            <Link 
                                to="/propietario/infomas" 
                                onClick={() => handleNavClick("mascotas")}
                            >
                                <FaPaw />
                                <span>Mis Mascotas</span>
                            </Link>
                        </li>
                        <li className={activeItem === "citas" ? "active" : ""}>
                            <Link 
                                to="/propietario/citas" 
                                onClick={() => handleNavClick("citas")}
                            >
                                <FaCalendarAlt />
                                <span>Citas</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={logout}>
                        <FaSignOutAlt />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            
        </div>
    );
}
