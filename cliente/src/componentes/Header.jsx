import React, { useState, useEffect } from 'react';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import '../stylos/Header.css';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Hook para obtener la ubicación actual
  
  // Función para verificar si un enlace está activo
  const isActive = (path) => {
    if (path === '/#servicios') {
      return location.pathname === '/' && location.hash === '#servicios';
    }
    if (path === '/#blog') {
      return location.pathname === '/' && location.hash === '#blog';
    }
    if (path === '/#contacto') {
      return location.pathname === '/' && location.hash === '#contacto';
    }
  
    if (path === '/') {
      // Solo marcar "Inicio" si NO hay hash en la URL
      return location.pathname === '/' && location.hash === '';
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="akeso-veterinaria">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <img src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/logo.png" alt="Akeso Veterinary Clinic" />
              </Link>
            </div>

            <nav className="desktop-nav">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Inicio
              </Link>
              <Link to="/#servicios" className={`nav-link ${isActive('/#servicios') ? 'active' : ''}`}>
                  Servicios
              </Link>
              <Link to="/nosotros" className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`}>
                Nosotros
              </Link>
              <Link to="/#blog" className={`nav-link ${isActive('/#blog') ? 'active' : ''}`}>
                Blog
              </Link>
              <Link to="/#contacto" className={`nav-link ${isActive('/#contacto') ? 'active' : ''}`}>
                Contacto
              </Link>
              <Link to="/login" className="btn btn-primary">
                <FaUser /> Inicio de Sesión
              </Link>
            </nav>

            <button 
              className="menu-toggle" 
              id="menuToggle" 
              onClick={toggleMobileMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
          <nav className="mobile-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Inicio
            </Link>
            <Link to="/#servicios" className={`nav-link ${isActive('/#servicios') ? 'active' : ''}`}>
              Servicios
            </Link>
            <Link to="/nosotros" className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`}>
              Nosotros
            </Link>
            <Link to="/#blog" className={`nav-link ${isActive('/#blog') ? 'active' : ''}`}>
              Blog
            </Link>
            <Link to="/#contacto" className={`nav-link ${isActive('/#contacto') ? 'active' : ''}`}>
              Contacto
            </Link>
            <Link to="/login" className="btn btn-primary btn-full">
              <FaUser /> Inicio de sesión
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;