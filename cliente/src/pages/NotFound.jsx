"use client"
import { Link } from "react-router-dom"
import { FaPaw, FaHome, FaArrowLeft } from "react-icons/fa"
import Header from "../componentes/Header"
import Footer from "../componentes/Footer"
import "../stylos/Home.css"
import "../stylos/Base.css"
import "../stylos/NotFound.css"

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Header />
      <div className="akeso-veterinaria not-found-container">
        <section className="not-found-hero">
          <div className="not-found-bg"></div>
          <div className="container">
            <div className="not-found-content">
              <div className="not-found-icon">
                <FaPaw />
              </div>

              <h1 className="not-found-title">404</h1>
              <h2 className="not-found-subtitle">Página no encontrada</h2>

              <p className="not-found-message">
                Lo sentimos, la página que estás buscando parece haberse perdido, como un cachorro travieso.
              </p>

              <div className="not-found-buttons">
                <Link to="/" className="btn btn-primary btn-lg">
                  <FaHome style={{ marginRight: "0.5rem" }} /> Volver al inicio
                </Link>
                <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
                  <FaArrowLeft style={{ marginRight: "0.5rem" }} /> Regresar
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
