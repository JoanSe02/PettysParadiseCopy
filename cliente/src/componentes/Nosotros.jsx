import React from "react";
import "../stylos/Nosotros.css";
import { FaCheckCircle, FaHeart, FaSlidersH } from "react-icons/fa";

function Nosotros() {
  return (
    <>
     
      {/* Espacio adicional antes del footer */}
        <div className="pre-home-space"></div>
      {/* Hero Section */}
      <section className="hero1">
        <div className="container1">
          <h1 className="h11">Conozca Nuestro Equipo</h1>
          <p>Dedicados al cuidado y bienestar de sus mascotas desde 2024</p>
        </div>
      </section>


    <section className="about1">
      <div className="container">
        <div className="about-content1">
          <div className="about-image1">
            <img
              src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/equipo%20veterinario.jpg"
              alt="Equipo veterinario"
              className="rounded-image"
            />
          </div>
          <div className="about-text1">
            <h2 className="h21">Nuestra Historia</h2>
            <p>
              Fundada en 2024, nuestra clínica veterinaria nació con la misión
              de proporcionar atención médica de calidad a las mascotas de
              nuestra comunidad. Lo que comenzó como una pequeña consulta ha
              crecido hasta convertirse en un centro veterinario completo con
              tecnología de vanguardia.
            </p>
            <p>
              Nuestro equipo está formado por profesionales apasionados por
              los animales, comprometidos con ofrecer el mejor cuidado posible
              a cada paciente que entra por nuestras puertas.
            </p>
           
          </div>
        </div>
      </div>
    </section>


      {/* Misión y Valores */}
      <section className="mission-values">
        <div className="container">
          <h2 className="h21">Nuestra Misión y Valores</h2>
          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">
                <FaCheckCircle />
              </div>
              <h3 className="h31">Excelencia</h3>
              <p>
                Nos esforzamos por ofrecer el más alto nivel de atención
                veterinaria, manteniéndonos actualizados con las últimas técnicas
                y tecnologías.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaHeart />
              </div>
              <h3 className="h31">Compasión</h3>
              <p>
                Tratamos a cada mascota con el cuidado y la atención que merecen,
                entendiendo el vínculo especial entre las mascotas y sus dueños.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaSlidersH />
              </div>
              <h3 className="h31">Innovación</h3>
              <p>
                Buscamos constantemente nuevas formas de mejorar nuestros servicios
                y ofrecer soluciones innovadoras para el cuidado de las mascotas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instalaciones Section */}
<section className="facilities">
  <div className="container">
    <h2 className="h21">Nuestras Instalaciones</h2>
    <p className="section-intro">
      Contamos con instalaciones modernas y equipadas con la última tecnología para brindar la mejor atención a tu mascota.
    </p>
    <div className="facilities-container">
      <div className="facility-card">
        <div className="facility-image">
          <img
            src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/consultorios.jpg"
            alt="Sala de consultas"
          />
        </div>
        <h3 className="h31">Consultorios</h3>
        <p className="facility-desc">
          Espacios cómodos y tranquilos diseñados para que tu mascota se sienta segura durante la consulta veterinaria.
        </p>
      </div>

      <div className="facility-card">
        <div className="facility-image">
          <img
            src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/quirofano.webp"
            alt="Quirófano"
          />
        </div>
        <h3 className="h31">Quirófano</h3>
        <p className="facility-desc">
          Equipado con tecnología de vanguardia para realizar procedimientos quirúrgicos con los más altos estándares de seguridad.
        </p>
      </div>

      <div className="facility-card">
        <div className="facility-image">
          <img
            src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/laboratorio.jpg"
            alt="Laboratorio"
          />
        </div>
        <h3 className="h31">Laboratorio</h3>
        <p className="facility-desc">
          Realizamos análisis clínicos con equipos de última generación para diagnósticos rápidos y precisos.
        </p>
      </div>

      
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="h21">Lo Que Dicen Nuestros Clientes</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>M</span>
                </div>
                <div className="testimonial-info">
                  <h3 className="h31">María López</h3>
                  <p>Dueña de Max</p>
                </div>
              </div>
              <p className="testimonial-text">
                "El equipo de PetCare ha cuidado de mi perro Max durante años. Su profesionalismo y cariño hacia los
                animales es incomparable. Siempre me siento tranquila dejando a mi mascota en sus manos."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>J</span>
                </div>
                <div className="testimonial-info">
                  <h3 className="h31">Juan Pérez</h3>
                  <p>Dueño de Luna</p>
                </div>
              </div>
              <p className="testimonial-text">
                "Cuando mi gata Luna necesitó una cirugía compleja, el Dr. Rodríguez y su equipo fueron increíbles. No
                solo realizaron un excelente trabajo médico, sino que también nos mantuvieron informados durante todo el
                proceso."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>S</span>
                </div>
                <div className="testimonial-info">
                  <h3 className="h31">Sofía Ramírez</h3>
                  <p>Dueña de Coco</p>
                </div>
              </div>
              <p className="testimonial-text">
                "He llevado a todas mis mascotas a PetCare durante los últimos 10 años. Su atención personalizada y el
                cuidado que brindan es excepcional. Los recomiendo sin dudarlo."
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}

export default Nosotros;

