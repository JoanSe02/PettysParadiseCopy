"use client"

import { useState, useEffect } from "react"
import { Calendar, List, Eye, Edit, X, Check, RefreshCw, CalendarIcon, RotateCcw } from "lucide-react"
import "../stylos/Citas.css"
import Dashboard from "../propietario/Dashbord"
import { apiService } from "../services/api-service"

export default function GestionCitas() {
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCita, setSelectedCita] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState("all")
  const [filtroMascota, setFiltroMascota] = useState("all")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [mascotas, setMascotas] = useState([])
  const [servicios, setServicios] = useState([])
  const [veterinarios, setVeterinarios] = useState([])

  // Obtener datos del usuario
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const userId = userData.id_usuario

  // Cargar citas al iniciar
  useEffect(() => {
    fetchCitas()
    fetchMascotas()
    fetchServicios()
    fetchVeterinarios()
  }, [])

  // Función para obtener citas
  const fetchCitas = async () => {
    setLoading(true)
    try {
      const data = await apiService.get("/api/citas")

      // Ordenar citas por fecha (más reciente primero)
      const citasOrdenadas = data.sort((a, b) => {
        // Primero comparar por fecha
        const fechaA = new Date(a.fech_cit || a.fecha)
        const fechaB = new Date(b.fech_cit || b.fecha)

        if (fechaA > fechaB) return -1
        if (fechaA < fechaB) return 1

        // Si las fechas son iguales, comparar por hora
        const horaA = a.hora || "00:00"
        const horaB = b.hora || "00:00"

        if (horaA > horaB) return -1
        if (horaA < horaB) return 1

        return 0
      })

      setCitas(citasOrdenadas)
    } catch (err) {
      console.error("Error al cargar citas:", err)
      setError(err.message || "Error al cargar las citas")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener mascotas del propietario
  const fetchMascotas = async () => {
    try {
      const data = await apiService.get("/api/vermas/mascotas")
      setMascotas(data)
    } catch (err) {
      console.error("Error al cargar mascotas:", err)
    }
  }

  // Función para obtener servicios
  const fetchServicios = async () => {
    try {
      const data = await apiService.get("/api/servicios/servicios")
      setServicios(data)
    } catch (err) {
      console.error("Error al cargar servicios:", err)
    }
  }

  // Función para obtener veterinarios
  const fetchVeterinarios = async () => {
    try {
      const data = await apiService.get("/api/servicios/veterinarios")
      setVeterinarios(data)
    } catch (err) {
      console.error("Error al cargar veterinarios:", err)
    }
  }

  // Función para crear una nueva cita
  const crearCita = async (citaData) => {
    try {
      // Mapear los campos del frontend a los del backend
      const backendData = {
        cod_mas: Number.parseInt(citaData.codigo_mascota),
        cod_ser: Number.parseInt(citaData.id_servicio),
        id_vet: Number.parseInt(citaData.id_veterinario),
        fech_cit: citaData.fecha,
        hora: citaData.hora,
        notas: citaData.notas || "",
      }

      await apiService.post("/api/citas", backendData)
      await fetchCitas() // Recargar citas
      setShowModal(false)
    } catch (err) {
      console.error("Error al crear cita:", err)
      alert("Error al crear la cita: " + (err.message || "Error desconocido"))
    }
  }

  // Función para actualizar una cita
  const actualizarCita = async (citaData) => {
    try {
      // Mapear los campos del frontend a los del backend
      const backendData = {
        cod_mas: Number.parseInt(citaData.codigo_mascota),
        cod_ser: Number.parseInt(citaData.id_servicio),
        id_vet: Number.parseInt(citaData.id_veterinario),
        fech_cit: citaData.fecha,
        hora: citaData.hora,
        estado: citaData.estado,
        notas: citaData.notas || "",
      }

      await apiService.put(`/api/citas/${citaData.codigo}`, backendData)
      await fetchCitas() // Recargar citas
      setShowEditModal(false)
    } catch (err) {
      console.error("Error al actualizar cita:", err)
      alert("Error al actualizar la cita: " + (err.message || "Error desconocido"))
    }
  }

  // Función para cancelar una cita
  const cancelarCita = async (codigo) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await apiService.put(`/api/citas/${codigo}/cancelar`)
        await fetchCitas() // Recargar citas
      } catch (err) {
        console.error("Error al cancelar cita:", err)
        alert("Error al cancelar la cita: " + (err.message || "Error desconocido"))
      }
    }
  }

  // Función para reagendar una cita
  const reagendarCita = (cita) => {
    setSelectedCita(cita)
    setShowEditModal(true)
  }

  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroEstado("all")
    setFiltroMascota("all")
    setFiltroFecha("")
  }

  // Filtrar citas según los criterios seleccionados
  const citasFiltradas = citas.filter((cita) => {
    // Filtro por estado
    if (filtroEstado !== "all" && cita.estado !== filtroEstado) {
      return false
    }

    // Filtro por mascota
    if (filtroMascota !== "all" && (cita.cod_mas || cita.codigo_mascota) !== Number.parseInt(filtroMascota)) {
      return false
    }

    // Filtro por fecha
    if (filtroFecha) {
      const citaFecha = new Date(cita.fech_cit || cita.fecha)
      const filtroFechaObj = new Date(filtroFecha)
      if (citaFecha.toDateString() !== filtroFechaObj.toDateString()) {
        return false
      }
    }

    return true
  })

  return (
    <div className={`dashboard-container ${sidebarOpen ? "sidebar-collapsed" : ""}`}>
      <Dashboard />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-body">
          {/* Citas Header */}
          <div className="citas-header">
            <div className="citas-title">
              <h2>Tus Citas</h2>
              <p>Gestiona tus citas veterinarias programadas</p>
            </div>
            <button className="add-cita-btn" onClick={() => setShowModal(true)}>
              <span className="plus-icon">+</span> Nueva Cita
            </button>
          </div>

          {/* Filters */}
          <div className="citas-filters">
            <div className="filter-group">
              <label htmlFor="filter-status">Estado:</label>
              <select
                id="filter-status"
                className="filter-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="NO_ASISTIDA">No Asistida</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-pet">Mascota:</label>
              <select
                id="filter-pet"
                className="filter-select"
                value={filtroMascota}
                onChange={(e) => setFiltroMascota(e.target.value)}
              >
                <option value="all">Todas</option>
                {mascotas.map((mascota) => (
                  <option key={mascota.cod_mas || mascota.codigo} value={mascota.cod_mas || mascota.codigo}>
                    {mascota.nom_mas || mascota.nombre} ({mascota.raza})
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-date">Fecha:</label>
              <div className="date-input-container">
                <input
                  type="date"
                  id="filter-date"
                  className="filter-input"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
                <span className="calendar-icon">
                  <CalendarIcon size={16} />
                </span>
              </div>
            </div>
            <button className="clear-filters-btn" onClick={limpiarFiltros}>
              <RotateCcw size={16} className="clear-icon" /> Limpiar filtros
            </button>
          </div>

          {/* Solo vista de lista */}
          <div className="view-toggle">
            <button className="view-btn active">
              <List size={16} className="view-icon" /> Lista
            </button>
          </div>

          {/* Citas List */}
          <div className="citas-list">
            {loading ? (
              <div className="loading-message">Cargando citas...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : citasFiltradas.length === 0 ? (
              <div className="empty-message">No hay citas que coincidan con los filtros seleccionados</div>
            ) : (
              citasFiltradas.map((cita) => (
                <CitaCard
                  key={cita.cod_cit || cita.codigo}
                  cita={cita}
                  onView={() => {
                    setSelectedCita(cita)
                    setShowViewModal(true)
                  }}
                  onEdit={() => {
                    setSelectedCita(cita)
                    setShowEditModal(true)
                  }}
                  onCancel={() => cancelarCita(cita.cod_cit || cita.codigo)}
                  onReschedule={() => reagendarCita(cita)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal Nueva Cita */}
      {showModal && (
        <NuevaCitaModal
          onClose={() => setShowModal(false)}
          onSubmit={crearCita}
          mascotas={mascotas}
          servicios={servicios}
          veterinarios={veterinarios}
        />
      )}

      {/* Modal Ver Cita */}
      {showViewModal && selectedCita && (
        <VerCitaModal
          cita={selectedCita}
          onClose={() => setShowViewModal(false)}
          mascotas={mascotas}
          servicios={servicios}
          veterinarios={veterinarios}
          onReschedule={() => {
            setShowViewModal(false)
            reagendarCita(selectedCita)
          }}
        />
      )}

      {/* Modal Editar Cita */}
      {showEditModal && selectedCita && (
        <EditarCitaModal
          cita={selectedCita}
          onClose={() => setShowEditModal(false)}
          onSubmit={actualizarCita}
          mascotas={mascotas}
          servicios={servicios}
          veterinarios={veterinarios}
        />
      )}
    </div>
  )
}

// --- COMPONENTES AUXILIARES ---
function CitaCard({ cita, onView, onEdit, onCancel, onReschedule }) {
  // Usar los nombres de campo correctos y manejar fechas inválidas
  const fechaRaw = cita.fech_cit || cita.fecha
  const fecha = fechaRaw ? new Date(fechaRaw) : new Date()

  // Verificar si la fecha es válida
  const fechaValida = !isNaN(fecha.getTime())

  const mes = fechaValida ? fecha.toLocaleString("es", { month: "short" }).toUpperCase() : "---"
  const dia = fechaValida ? fecha.getDate() : "--"
  const año = fechaValida ? fecha.getFullYear() : "----"
  const hora = cita.hora ? cita.hora.substring(0, 5) : "00:00"

  // Determinar clase y texto según estado
  let statusClass = ""
  let statusIcon = null

  switch (cita.estado) {
    case "CONFIRMADA":
      statusClass = "confirmed"
      statusIcon = <span className="status-icon">✓</span>
      break
    case "PENDIENTE":
      statusClass = "pending"
      statusIcon = <span className="status-icon">⏱</span>
      break
    case "CANCELADA":
      statusClass = "canceled"
      statusIcon = <span className="status-icon">✕</span>
      break
    case "REALIZADA":
      statusClass = "completed"
      statusIcon = <span className="status-icon">✓</span>
      break
    case "NO_ASISTIDA":
      statusClass = "missed"
      statusIcon = <span className="status-icon">✕</span>
      break
    default:
      statusClass = "pending"
      statusIcon = <span className="status-icon">⏱</span>
  }

  return (
    <div className="cita-card">
      <div className="cita-date">
        <div className="month">{mes}</div>
        <div className="day">{dia}</div>
        <div className="year">{año}</div>
        <div className="time">{hora}</div>
      </div>
      <div className="cita-details">
        <div className="cita-info">
          <h3>{cita.servicio || "Servicio no especificado"}</h3>
          <div className="cita-meta">
            <span className="meta-item">
              <span className="meta-icon">🐾</span> {cita.mascota || "Mascota no especificada"}
            </span>
            <span className="meta-item">
              <span className="meta-icon">👨‍⚕</span> {cita.veterinario || "Veterinario no asignado"}
            </span>
          </div>
          <div className="cita-status">
            <span className={`status-badge ${statusClass}`}>
              {statusIcon} {cita.estado}
            </span>
          </div>
        </div>
        <div className="cita-actions">
          <button className="action-btn view-btn" onClick={onView}>
            <Eye size={16} className="action-icon" /> Ver
          </button>
          {cita.estado !== "CANCELADA" && cita.estado !== "REALIZADA" && (
            <>
              <button className="action-btn edit-btn" onClick={onEdit}>
                <Edit size={16} className="action-icon" /> Editar
              </button>
              <button className="action-btn reschedule-btn" onClick={onReschedule}>
                <Calendar size={16} className="action-icon" /> Reagendar
              </button>
              <button className="action-btn cancel-btn" onClick={onCancel}>
                <X size={16} className="action-icon" /> Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function NuevaCitaModal({ onClose, onSubmit, mascotas, servicios, veterinarios }) {
  const [formData, setFormData] = useState({
    codigo_mascota: "",
    id_servicio: "",
    id_veterinario: "",
    fecha: "",
    hora: "",
    notas: "",
  })

  const [errors, setErrors] = useState({})

  // Calcular fechas mínima y máxima permitidas
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 1)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Validar en tiempo real
    if (id === "fecha") {
      validateDate(value)
    } else if (id === "hora") {
      validateTime(value)
    }
  }

  const validateDate = (date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const oneMonthLater = new Date()
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)
    oneMonthLater.setHours(23, 59, 59, 999)

    if (selectedDate <= today) {
      setErrors((prev) => ({ ...prev, fecha: "La cita debe ser a partir de mañana" }))
      return false
    } else if (selectedDate > oneMonthLater) {
      setErrors((prev) => ({ ...prev, fecha: "La cita no puede ser más de un mes en el futuro" }))
      return false
    } else {
      setErrors((prev) => ({ ...prev, fecha: null }))
      return true
    }
  }

  const validateTime = (time) => {
    if (!time) {
      setErrors((prev) => ({ ...prev, hora: "La hora es requerida" }))
      return false
    }

    const [hours, minutes] = time.split(":").map(Number)

    if (hours < 8 || hours > 19 || (hours === 19 && minutes > 0)) {
      setErrors((prev) => ({ ...prev, hora: "El horario de atención es de 8:00 AM a 7:00 PM" }))
      return false
    } else {
      setErrors((prev) => ({ ...prev, hora: null }))
      return true
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar antes de enviar
    const isDateValid = validateDate(formData.fecha)
    const isTimeValid = validateTime(formData.hora)

    if (isDateValid && isTimeValid) {
      onSubmit(formData)
    }
  }

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains("modal") && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nueva Cita</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form id="newCitaForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="codigo_mascota">Mascota:</label>
              <select id="codigo_mascota" value={formData.codigo_mascota} onChange={handleChange} required>
                <option value="">Seleccionar mascota</option>
                {mascotas.map((mascota) => (
                  <option key={mascota.cod_mas || mascota.codigo} value={mascota.cod_mas || mascota.codigo}>
                    {mascota.nom_mas || mascota.nombre} ({mascota.raza})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_servicio">Servicio:</label>
              <select id="id_servicio" value={formData.id_servicio} onChange={handleChange} required>
                <option value="">Seleccionar servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.cod_ser || servicio.codigo} value={servicio.cod_ser || servicio.codigo}>
                    {servicio.nom_ser || servicio.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_veterinario">Veterinario:</label>
              <select id="id_veterinario" value={formData.id_veterinario} onChange={handleChange} required>
                <option value="">Seleccionar veterinario</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id_vet || vet.id_usuario} value={vet.id_vet || vet.id_usuario}>
                    {vet.nombre} {vet.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha:</label>
                <input
                  type="date"
                  id="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDateStr}
                  required
                />
                {errors.fecha && <p className="error-message2">{errors.fecha}</p>}
                <small className="help-text">
                  Las citas deben ser agendadas con al menos un día de anticipación y máximo un mes.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <input
                  type="time"
                  id="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  min="08:00"
                  max="19:00"
                  required
                />
                {errors.hora && <p className="error-message2">{errors.hora}</p>}
                <small className="help-text">Horario de atención: 8:00 AM - 7:00 PM</small>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notas">Notas adicionales:</label>
              <textarea id="notas" rows={3} value={formData.notas} onChange={handleChange} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="cancel-modal-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Agendar Cita
          </button>
        </div>
      </div>
    </div>
  )
}

function VerCitaModal({ cita, onClose, mascotas, servicios, veterinarios, onReschedule }) {
  // Encontrar nombres completos usando los campos correctos
  const mascota = mascotas.find((m) => (m.cod_mas || m.codigo) === (cita.cod_mas || cita.codigo_mascota))
  const servicio = servicios.find((s) => (s.cod_ser || s.codigo) === (cita.cod_ser || cita.id_servicio))
  const veterinario = veterinarios.find((v) => (v.id_vet || v.id_usuario) === (cita.id_vet || cita.id_veterinario))

  const fechaRaw = cita.fech_cit || cita.fecha
  const fechaValida = fechaRaw && !isNaN(new Date(fechaRaw).getTime())

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains("modal") && onClose()}>
      <div className="modal-content modal-view">
        <div className="modal-header">
          <h2>Detalles de la Cita</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="cita-details-view">
            <div className="detail-group">
              <h3>Información General</h3>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={`status-text ${cita.estado.toLowerCase()}`}>{cita.estado}</span>
              </p>
              <p>
                <strong>Fecha:</strong> {fechaValida ? new Date(fechaRaw).toLocaleDateString() : "Fecha inválida"}
              </p>
              <p>
                <strong>Hora:</strong> {cita.hora ? cita.hora.substring(0, 5) : "No especificada"}
              </p>
            </div>

            <div className="detail-group">
              <h3>Servicio</h3>
              <p>{servicio ? servicio.nom_ser || servicio.nombre : "No especificado"}</p>
              <p className="detail-description">{servicio ? servicio.descripcion : ""}</p>
              {servicio && servicio.precio && (
                <p>
                  <strong>Precio:</strong> ${parseFloat(servicio.precio).toString()}
                </p>
              )}
            </div>

            <div className="detail-group">
              <h3>Mascota</h3>
              <p>{mascota ? `${mascota.nom_mas || mascota.nombre} (${mascota.raza})` : "No especificada"}</p>
              {mascota && (
                <>
                  <p>
                    <strong>Especie:</strong> {mascota.especie}
                  </p>
                  <p>
                    <strong>Edad:</strong> {parseFloat(mascota.edad).toString()} años
                  </p>
                  <p>
                    <strong>Peso:</strong> {parseFloat(mascota.peso).toString()} kg
                  </p>
                </>
              )}
            </div>

            <div className="detail-group">
              <h3>Veterinario</h3>
              <p>{veterinario ? `Dr. ${veterinario.nombre} ${veterinario.apellido}` : "No asignado"}</p>
              {veterinario && veterinario.especialidad && (
                <p>
                  <strong>Especialidad:</strong> {veterinario.especialidad}
                </p>
              )}
            </div>

            {cita.notas && (
              <div className="detail-group">
                <h3>Notas</h3>
                <p>{cita.notas}</p>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          {cita.estado !== "CANCELADA" && cita.estado !== "REALIZADA" && (
            <button className="reschedule-btn" onClick={onReschedule}>
              <Calendar size={16} className="mr-2" /> Reagendar
            </button>
          )}
          <button className="submit-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function EditarCitaModal({ cita, onClose, onSubmit, mascotas, servicios, veterinarios }) {
  const [formData, setFormData] = useState({
    codigo: cita.cod_cit || cita.codigo,
    codigo_mascota: cita.cod_mas || cita.codigo_mascota || "",
    id_servicio: cita.cod_ser || cita.id_servicio || "",
    id_veterinario: cita.id_vet || cita.id_veterinario || "",
    fecha: cita.fech_cit || cita.fecha ? new Date(cita.fech_cit || cita.fecha).toISOString().split("T")[0] : "",
    hora: cita.hora || "",
    estado: cita.estado || "PENDIENTE",
    notas: cita.notas || "",
    id_usuario: cita.id_pro || cita.id_usuario,
  })

  const [errors, setErrors] = useState({})

  // Calcular fechas mínima y máxima permitidas
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 1)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Validar en tiempo real
    if (id === "fecha") {
      validateDate(value)
    } else if (id === "hora") {
      validateTime(value)
    }
  }

  const validateDate = (date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const oneMonthLater = new Date()
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)
    oneMonthLater.setHours(23, 59, 59, 999)

    if (selectedDate <= today) {
      setErrors((prev) => ({ ...prev, fecha: "La cita debe ser a partir de mañana" }))
      return false
    } else if (selectedDate > oneMonthLater) {
      setErrors((prev) => ({ ...prev, fecha: "La cita no puede ser más de un mes en el futuro" }))
      return false
    } else {
      setErrors((prev) => ({ ...prev, fecha: null }))
      return true
    }
  }

  const validateTime = (time) => {
    if (!time) {
      setErrors((prev) => ({ ...prev, hora: "La hora es requerida" }))
      return false
    }

    const [hours, minutes] = time.split(":").map(Number)

    if (hours < 8 || hours > 19 || (hours === 19 && minutes > 0)) {
      setErrors((prev) => ({ ...prev, hora: "El horario de atención es de 8:00 AM a 7:00 PM" }))
      return false
    } else {
      setErrors((prev) => ({ ...prev, hora: null }))
      return true
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar antes de enviar
    const isDateValid = validateDate(formData.fecha)
    const isTimeValid = validateTime(formData.hora)

    if (isDateValid && isTimeValid) {
      onSubmit(formData)
    }
  }

  const confirmarCita = () => {
    setFormData((prev) => ({
      ...prev,
      estado: "CONFIRMADA",
    }))
  }

  const cancelarCita = () => {
    setFormData((prev) => ({
      ...prev,
      estado: "CANCELADA",
    }))
  }

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains("modal") && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Cita</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="estado-actions">
            <p>
              Estado actual: <span className={`status-text ${formData.estado.toLowerCase()}`}>{formData.estado}</span>
            </p>
            <div className="estado-buttons">
              <button
                className={`estado-btn confirm-btn ${formData.estado === "CONFIRMADA" ? "active" : ""}`}
                onClick={confirmarCita}
                type="button"
              >
                <Check size={16} /> Confirmar
              </button>
              <button
                className={`estado-btn cancel-btn ${formData.estado === "CANCELADA" ? "active" : ""}`}
                onClick={cancelarCita}
                type="button"
              >
                <X size={16} /> Cancelar
              </button>
            </div>
          </div>

          <form id="editCitaForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="codigo_mascota">Mascota:</label>
              <select id="codigo_mascota" value={formData.codigo_mascota} onChange={handleChange} required>
                <option value="">Seleccionar mascota</option>
                {mascotas.map((mascota) => (
                  <option key={mascota.cod_mas || mascota.codigo} value={mascota.cod_mas || mascota.codigo}>
                    {mascota.nom_mas || mascota.nombre} ({mascota.raza})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_servicio">Servicio:</label>
              <select id="id_servicio" value={formData.id_servicio} onChange={handleChange} required>
                <option value="">Seleccionar servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.cod_ser || servicio.codigo} value={servicio.cod_ser || servicio.codigo}>
                    {servicio.nom_ser || servicio.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_veterinario">Veterinario:</label>
              <select id="id_veterinario" value={formData.id_veterinario} onChange={handleChange} required>
                <option value="">Seleccionar veterinario</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id_vet || vet.id_usuario} value={vet.id_vet || vet.id_usuario}>
                    {vet.nombre} {vet.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha:</label>
                <input
                  type="date"
                  id="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDateStr}
                  required
                />
                {errors.fecha && <p className="error-message">{errors.fecha}</p>}
                <small className="help-text">
                  Las citas deben ser agendadas con al menos un día de anticipación y máximo un mes.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <input
                  type="time"
                  id="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  min="08:00"
                  max="19:00"
                  required
                />
                {errors.hora && <p className="error-message">{errors.hora}</p>}
                <small className="help-text">Horario de atención: 8:00 AM - 7:00 PM</small>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notas">Notas adicionales:</label>
              <textarea id="notas" rows={3} value={formData.notas} onChange={handleChange} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="cancel-modal-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            <RefreshCw size={16} className="mr-2" /> Actualizar Cita
          </button>
        </div>
      </div>
    </div>
  )
}

