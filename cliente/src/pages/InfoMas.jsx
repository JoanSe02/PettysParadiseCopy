"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../stylos/InfoMas.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faEye, faEdit, faPaw, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons"
import Dashboard from "../propietario/Dashbord.jsx"
import axios from "axios"

const InfoMas = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  })
  const API_URL = "http://localhost:5000"

  // Función para cargar las mascotas del usuario
  const fetchMascotas = async () => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      // Hacer la petición al endpoint con el token
      const response = await axios.get(`${API_URL}/api/vermas/mascotas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Actualizar el estado con las mascotas recibidas
      setMascotas(response.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Cargar datos del usuario del localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setUserData({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      email: user.email || "",
    })

    // Cargar las mascotas
    fetchMascotas()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tus mascotas...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Dashboard></Dashboard>
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Tus Mascotas</h1>
            <p>Administra la información de tus mascotas</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Buscar mascota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="mascotas-header">
            <div className="mascotas-title">
              <h2>Tus Mascotas</h2>
              <p>Información y registros de tus mascotas</p>
            </div>
          </div>

          {mascotas.length === 0 ? (
            <div className="no-pets-container">
              <div className="no-pets-content">
                <div className="no-pets-icon">
                  <FontAwesomeIcon icon={faPaw} />
                </div>
                <h3>No tienes mascotas registradas</h3>
              </div>
            </div>
          ) : (
            <div className="pet-cards-container">
              {mascotas
                .filter((mascota) =>
                  // Add a check to ensure mascota.nombre exists before calling toLowerCase()
                  mascota.nombre && searchTerm ? mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                )
                .map((mascota) => (
                  <div key={mascota.id} className="pet-card">
                    <div className="pet-card-header">
                      <div
                        className="pet-avatar"
                        style={{ backgroundImage: `url(${mascota.foto || "/placeholder.svg?height=90&width=90"})` }}
                      ></div>
                      <div className="pet-basic-info">
                        <h3>{mascota.nom_mas|| "Sin nombre"}</h3>
                        <div className="pet-type-breed">
                         
                          {mascota.raza && <span> • {mascota.raza}</span>}
                        </div>
                        <div className="pet-tags">
                          <span className="pet-age">{parseFloat(mascota.edad).toString() || "?"} años</span>
                          <span className={`pet-gender ${mascota.genero === "Macho" ? "male" : "female"}`}>
                            {mascota.genero === "Macho" ? "♂" : "♀"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pet-card-body">
                      <div className="info-row">
                        <div className="info-icon">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Última visita</div>
                          <div className="info-value">{mascota.ultimaVisita || "No registrada"}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <div className="info-icon">
                          <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Próxima cita</div>
                          <div className="info-value">Próximamente</div>
                        </div>
                      </div>
                    </div>

                    <div className="pet-card-footer">
                      <Link to={`/propietario/mascotas/${mascota.id}`} className="pet-action-btn view-btn">
                        <FontAwesomeIcon icon={faEye} /> Ver Detalles
                      </Link>
                      <Link to={`/propietario/editar-mascota/${mascota.id}`} className="pet-action-btn edit-btn">
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default InfoMas




