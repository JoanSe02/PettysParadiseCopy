"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaPaw,
  FaUser,
  FaChevronRight,
  FaShieldAlt,
  FaHeart,
  FaStethoscope,
  FaCut,
  FaPills,
  FaFileMedical,
  FaHome,
  FaBookMedical,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaMapMarked,
  FaDirections,
  FaClinicMedical,
  FaCalendarCheck,
  FaAmbulance,
  FaUserMd,
  FaHospital,
  FaMicroscope,
} from "react-icons/fa"
import "../stylos/Home.css"
import "../stylos/Base.css"
import { Link, useLocation } from "react-router-dom"

const Home = () => {
  // Referencias para los contadores
  const specialistsCounterRef = useRef(null)
  const patientsCounterRef = useRef(null)
  const yearsCounterRef = useRef(null)
  const servicesCounterRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  // Estado para los contadores
  const [counters, setCounters] = useState({
    specialists: 0,
    patients: 0,
    years: 0,
    services: 0,
    hours: 0,
    days: 0,
  })

  // Valores finales para los contadores
  const counterTargets = {
    specialists: 10,
    patients: 5000,
    years: 4,
    services: 12,
    hours: 24,
    days: 7,
  }

  // Función para animar los contadores
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters()
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)

    if (specialistsCounterRef.current) {
      observer.observe(specialistsCounterRef.current)
    }

    return () => {
      if (specialistsCounterRef.current) {
        observer.unobserve(specialistsCounterRef.current)
      }
    }
  }, [])

  const startCounters = () => {
    const duration = 2000 // 2 segundos para la animación
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames

      setCounters({
        specialists: Math.floor(counterTargets.specialists * progress),
        patients: Math.floor(counterTargets.patients * progress),
        years: Math.floor(counterTargets.years * progress),
        services: Math.floor(counterTargets.services * progress),
        hours: Math.floor(counterTargets.hours * progress),
        days: Math.floor(counterTargets.days * progress),
      })

      if (frame === totalFrames) {
        clearInterval(counter)
        setCounters(counterTargets)
      }
    }, frameDuration)
  }

  return (
    <div className="akeso-veterinaria">
      <main>
        {/* Hero Section */}
        <section id="inicio" className="hero-section">
          <div className="hero-bg"></div>
          <div className="container1">
            <div className="hero-content">
              <div className="hero-text">
                <div className="badge1">
                  <FaPaw />
                  Cuidado veterinario profesional
                </div>
                <h1 className="h1">
                  Salud y <span className="highlight">bienestar</span> para tu mascota
                </h1>
                <p>
                  En Petty's Paradise combinamos experiencia, tecnología y cariño para ofrecer el mejor cuidado a tus
                  compañeros.
                </p>
                <div className="button-group">
                  <Link to="/login" className="btn btn-primary btn-lg">
                    Agendar una cita <FaChevronRight className="flecha" />
                  </Link>
                  <button className="btn btn-outline btn-lg">Nuestros servicios</button>
                </div>
              </div>
              <div className="hero-image">
                <div className="image-decoration circle-1"></div>
                <div className="image-decoration circle-2"></div>
                <div className="image-container">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/Veterinario%20con%20mascota.jpg"
                    alt="Veterinario con mascota"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar" ref={specialistsCounterRef}>
            <div className="container">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaUser />
                  </div>
                  <div className="stat-number">+{counters.specialists}</div>
                  <p>Especialistas</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaClock />
                  </div>
                  <div className="stat-number">
                    {counters.hours}/{counters.days}
                  </div>
                  <p>Atención en clínica</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaPaw />
                  </div>
                  <div className="stat-number">+{counters.patients}</div>
                  <p>Pacientes atendidos</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaStethoscope />
                  </div>
                  <div className="stat-number">+{counters.services}</div>
                  <p>Servicios especializados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="services-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <div className="badge">
                  <FaShieldAlt />
                  Nuestros Servicios
                </div>
                <h2 className="h2">Cuidado integral para tu mascota</h2>
                <p>
                  Ofrecemos una amplia gama de servicios veterinarios para garantizar la salud y bienestar de tus
                  compañeros.
                </p>
              </div>
            </div>

            <div className="services-grid">
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaHeart />
                  </div>
                  <h3>Medicina Preventiva</h3>
                  <p>Vacunaciones, chequeos regulares y planes de prevención personalizados para cada etapa de vida.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaStethoscope />
                  </div>
                  <h3>Diagnóstico Avanzado</h3>
                  <p>Radiografías digitales, ecografías y análisis de laboratorio con resultados rápidos y precisos.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaCut />
                  </div>
                  <h3>Peluquería Canina</h3>
                  <p>Servicios de estética y cuidado del pelaje realizados por profesionales con experiencia.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaPills />
                  </div>
                  <h3>Farmacia Veterinaria</h3>
                  <p>Medicamentos de calidad y alimentos especializados para todas las necesidades de tu mascota.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaFileMedical />
                  </div>
                  <h3>Cirugía</h3>
                  <p>Procedimientos quirúrgicos con equipos modernos y técnicas mínimamente invasivas.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
              <div className="service-card">
                <div className="service-overlay"></div>
                <div className="service-content">
                  <div className="service-icon">
                    <FaHome />
                  </div>
                  <h3>Hospitalización</h3>
                  <p>Cuidados intensivos con monitoreo constante en un ambiente tranquilo y confortable.</p>
                  <Link to="/login" className="btn btn-white-outline">
                    Saber más <FaChevronRight className="flecha2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="nosotros" className="about-section">
          <div className="container">
            <div className="section-header">
              <div className="badge">
                <FaPaw />
                <span>Sobre Nosotros</span>
              </div>
              <h2 className="h2">Pasión por el cuidado animal</h2>
            </div>

            <div className="about-content">
              <div className="about-text">
                <p className="intro-text">
                  Desde 2024, Petty's Paradise ha sido sinónimo de excelencia en el cuidado veterinario. Nuestro
                  equipo de profesionales combina experiencia, tecnología de vanguardia y un profundo amor por los
                  animales.
                </p>

                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FaUserMd />
                    </div>
                    <div className="feature-content">
                      <h3>Equipo certificado</h3>
                      <p>Veterinarios con amplia experiencia y certificaciones internacionales</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <FaHospital />
                    </div>
                    <div className="feature-content">
                      <h3>Instalaciones modernas</h3>
                      <p>Espacios diseñados para el confort y seguridad de tu mascota</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <FaMicroscope />
                    </div>
                    <div className="feature-content">
                      <h3>Tecnología avanzada</h3>
                      <p>Equipamiento de última generación para diagnósticos precisos</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <FaStethoscope />
                    </div>
                    <div className="feature-content">
                      <h3>Atención personalizada</h3>
                      <p>Cuidado adaptado a las necesidades específicas de cada paciente</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-gallery">
                <div className="gallery-grid">
                  <div className="gallery-image main-image">
                    <img
                      src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/Veterinario%20con%20perro.jpg"
                      alt="Veterinario con perro"
                    />
                    <div className="image-caption">
                      <span>Cuidado profesional</span>
                    </div>
                  </div>

                  <div className="gallery-image secondary-image">
                    <img
                      src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/veterinariocongato.jpg"
                      alt="Veterinario con gato"
                    />
                    <div className="image-caption">
                      <span>Atención especializada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="blog-section">
          <div className="container">
            <div className="section-header-center">
              <div className="badge">
                <FaBookMedical />
                Nuestro Blog
              </div>
              <h2 className="h2">Consejos y artículos para el cuidado de tu mascota</h2>
              <p>Compartimos información valiosa para ayudarte a mantener a tus compañeros saludables y felices.</p>
            </div>

            <div className="blog-grid">
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/alimentacion.jpeg"
                    alt="Alimentación saludable para mascotas"
                  />
                  <div className="blog-category">Nutrición</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    {/* <span><FaCalendarAlt /> 15 Mayo, 2024</span>
                    <span><FaUser /> Dr. Carlos Rodríguez</span> */}
                  </div>
                  <h3>Alimentación saludable para tu mascota</h3>
                  <p>
                    Descubre los mejores consejos para una dieta equilibrada que mantendrá a tu mascota en óptimas
                    condiciones.
                  </p>
                </div>
              </div>
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/Cuidados.avif"
                    alt="Cuidados en verano"
                  />
                  <div className="blog-category">Cuidados</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    {/* <span><FaCalendarAlt /> 10 Mayo, 2024</span>
                    <span><FaUser /> Dra. Laura Martínez</span> */}
                  </div>
                  <h3>Cómo proteger a tu mascota del calor</h3>
                  <p>
                    El verano puede ser peligroso para nuestras mascotas. Aprende cómo mantenerlas frescas y seguras
                    durante los días calurosos.
                  </p>
                </div>
              </div>
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/Vacunacion.jpg"
                    alt="Vacunación de mascotas"
                  />
                  <div className="blog-category">Prevención</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    {/* <span><FaCalendarAlt /> 5 Mayo, 2024</span>
                    <span><FaUser /> Dr. Miguel Sánchez</span> */}
                  </div>
                  <h3>Guía completa de vacunación para perros y gatos</h3>
                  <p>
                    Todo lo que necesitas saber sobre el calendario de vacunación para mantener a tu mascota protegida
                    contra enfermedades.
                  </p>
                </div>
              </div>
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/Cuidado%20de%20mascotas%20exoticas.jpeg"
                    alt="Cuidado de mascotas exóticas"
                  />
                  <div className="blog-category">Exóticos</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    {/* <span><FaCalendarAlt /> 1 Mayo, 2024</span>
                    <span><FaUser /> Dra. Ana Gómez</span> */}
                  </div>
                  <h3>Cuidados básicos para mascotas exóticas</h3>
                  <p>
                    Consejos especializados para el cuidado de aves, reptiles y pequeños mamíferos que requieren
                    atención especial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <h2 className="h2">¿Listo para darle a tu mascota el cuidado que merece?</h2>
                <p>Agenda una cita hoy mismo y déjanos cuidar de la salud de tu compañero.</p>
                <div className="button-group">
                  <Link to="/login" className="btn btn-white">
                    <FaCalendarAlt /> Agendar una cita
                  </Link>
                </div>
              </div>
              <div className="cta-image">
                <div className="image-decoration circle-3"></div>
                <div className="image-decoration circle-4"></div>
                <div className="image-container">
                  <img
                    src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/mascota-en-familia.webp"
                    alt="Familia feliz con su mascota"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - REDISEÑO COMPLETO */}
        <section id="contacto" className="contact-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <div className="badge">
                  <FaEnvelope />
                  Contacto
                </div>
                <h2 className="h2">Estamos aquí para ayudarte</h2>
              </div>
            </div>

            <div className="contact-intro-container">
              <p className="contact-intro">
                Si tienes alguna pregunta o necesitas programar una cita, no dudes en contactarnos. Nuestro equipo de
                profesionales está listo para brindarte la mejor atención veterinaria para tu mascota.
              </p>
            </div>

            <div className="contact-main">
              <div className="contact-info">
                <div className="contact-card">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-text">
                    <h3>Dirección</h3>
                    <p>Av. Principal 123, Ciudad</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-text">
                    <h3>Teléfono</h3>
                    <p>+57 302 250 8786</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>info@pettys.com</p>
                    <p className="contact-subtext">Te respondemos en menos de 24h</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <FaCalendarCheck />
                  </div>
                  <div className="contact-text">
                    <h3>Horarios</h3>
                    <p>Lunes a Sabados: 9am-7pm</p>
                  </div>
                </div>

                <div className="contact-card emergency-card">
                  <div className="contact-icon emergency-icon">
                    <FaAmbulance />
                  </div>
                  <div className="contact-text">
                    <h3>Emergencias</h3>
                    <p className="emergency-text">Disponibles 24/7</p>
                    <p className="contact-subtext">
                      ¡Llámanos al +57 302 250 8786 o acércate a la clínica más cercana! Estamos listos para ayudarte a
                      ti y a tu peludito.
                    </p>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <div className="map-header">
                  <h3>
                    <FaMapMarked /> Nuestra ubicación
                  </h3>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
                    Ver en Google Maps
                  </a>
                </div>

                <div className="map-frame">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9728951469196!2d-74.07882492426827!3d4.598794042707592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a1f30307cf%3A0xf9b0cee3c2b5c3c9!2sUniversidad%20Nacional%20de%20Colombia!5e0!3m2!1ses!2sco!4v1682456789012!5m2!1ses!2sco"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de la clínica veterinaria"
                  ></iframe>
                </div>

                <div className="map-footer">
                  <div className="clinic-info">
                    <div className="clinic-icon">
                      <FaClinicMedical />
                    </div>
                    <div>
                      <h4>Petty's Paradise</h4>
                      <p>Atención veterinaria de calidad</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/maps?daddr=Universidad+Nacional+de+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <FaDirections /> Obtener indicaciones
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Espacio adicional antes del footer */}
        <div className="pre-footer-space"></div>
      </main>
    </div>
  )
}

export default Home
