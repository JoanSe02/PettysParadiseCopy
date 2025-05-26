"use client"
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import {
  FaPaw,
  FaBars,
  FaEnvelope,
  FaThLarge,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaCalendarCheck,
  FaPlus,
  FaFileMedical,
  FaSyringe,
  FaSearch,
  FaArrowRight
} from "react-icons/fa";
import '../stylos/Dashbord.css';
import '../stylos/Usu.css'
import Dashboard from'../propietario/Dashbord.jsx'

const PropietarioDashboard = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    petsCount: 0,
    upcomingAppointments: 0,
    remindersCount: 0,
    pets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const petsResponse = await axios.get(`${API_URL}/api/vermas/mascotas`);
        const petsData = petsResponse.data;
        
        setUserData({
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          email: user.email || "",
          petsCount: petsData.length || 0,
          upcomingAppointments: user.upcomingAppointments || 0,
          remindersCount: user.remindersCount || 0,
          pets: petsData || []
        });
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      const results = userData.pets.filter(pet => 
        pet.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Dashboard />
        <main className="main-content">
          <div className="loading-spinner">
            <p>Cargando datos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Dashboard />
        <main className="main-content">
          <div className="error-message">
            <p>Error: {error}</p>
            <p>Por favor, verifica tu conexión o intenta nuevamente más tarde.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Dashboard></Dashboard>
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Bienvenido de nuevo, {userData.nombre}</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Buscar mascota..." 
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  ×
                </button>
              )}
            </div>
          </div>
        </header>

        {showSearchResults && (
          <div className="search-results-container">
            <div className="search-results">
              <h3>Resultados de búsqueda ({searchResults.length})</h3>
              {searchResults.length > 0 ? (
                <ul className="results-list">
                  {searchResults.map(pet => (
                    <li key={pet.id} className="result-item">
                      <Link to={`/propietario/mascotas/${pet.id}`} onClick={clearSearch}>
                        <div className="pet-avatar" style={{ 
                          backgroundImage: `url(${pet.foto || '/default-pet.png'})` 
                        }}></div>
                        <div className="pet-info">
                          <h4>{pet.nombre}</h4>
                          <p>{pet.tipo} • {pet.raza || 'Sin raza especificada'}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-results">No se encontraron mascotas con ese nombre</p>
              )}
            </div>
          </div>
        )}

        <div className="content-body">
          <div className="welcome-section">
            <h2>Bienvenido, {userData.nombre}</h2>
            <p>Este es tu panel de control como propietario. Aquí puedes gestionar tus mascotas, citas y recordatorios.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaPaw />
              </div>
              <div className="stat-info">
                <h3>Mascotas Registradas</h3>
                <p className="stat-value">{userData.petsCount}</p>
              </div>
              <Link to="/propietario/infomas" className="card-link">
                Ver detalles <FaArrowRight />
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaCalendarCheck />
              </div>
              <div className="stat-info">
                <h3>Próximas Citas</h3>
                <p className="stat-value">{userData.upcomingAppointments}</p>
              </div>
              <Link to="/propietario/citas" className="card-link">
                Ver agenda <FaArrowRight />
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaBell />
              </div>
              <div className="stat-info">
                <h3>Ver Historial Citas</h3>
                <p className="stat-value">{userData.remindersCount}</p>
              </div>
              <Link to="/propietario/recordatorios" className="card-link">
                Ver recordatorios <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="quick-actions-section">
            <h3>Acciones rápidas</h3>
            <div className="action-buttons">
              <Link to="/propietario/mascotas" className="action-btn">
                <FaPlus />
                <span>Registrar nueva mascota</span>
              </Link>
              <Link to="/propietario/citas" className="action-btn">
                <FaCalendarAlt />
                <span>Agendar nueva cita</span>
              </Link>
              <Link to="/propietario/historial" className="action-btn">
                <FaFileMedical />
                <span>Ver historial médico</span>
              </Link>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Actividad reciente</h3>
            <div className="activity-list">
              {userData.pets.slice(0, 2).map(pet => (
                <div key={pet.id} className="activity-item">
                  <div className="activity-icon">
                    <FaCalendarCheck />
                  </div>
                  <div className="activity-details">
                    <h4>Última visita: {pet.nom_mas}</h4>
                    <p>{pet.ultimaVisita || "No hay visitas registradas"}</p>
                    <span className="activity-time">Ver detalles</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PropietarioDashboard