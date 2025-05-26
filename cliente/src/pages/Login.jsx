"use client"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import "../stylos/Login.css"
import { FaEye, FaEyeSlash, FaAt } from "react-icons/fa"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)
  const [intentosFallidos, setIntentosFallidos] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange", 
  })
  
  const validateEmail = (value) => {
    if (!value) return "El email es obligatorio";
    if (!value.includes("@")) return "Falta el símbolo @ en el email";
    const parts = value.split("@");
    if (parts.length < 2 || !parts[1]) return "Falta el dominio después del @";
    if (parts[1] && !parts[1].includes(".")) return "Falta el punto (.) en el dominio";
    const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!pattern.test(value)) return "El formato del email no es válido";
    return true;
  }

  const validatePassword = (value) => {
    if (!value) return "La contraseña es obligatoria";
    if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    
    const requirements = [];
    if (!/[A-Z]/.test(value)) requirements.push("una mayúscula");
    if (!/[a-z]/.test(value)) requirements.push("una minúscula");
    if (!/[0-9]/.test(value)) requirements.push("un número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) requirements.push("un carácter especial");
    
    if (requirements.length > 0) {
      return `La contraseña debe contener ${requirements.join(", ")}`;
    }
    
    return true;
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: data.email,
        contrasena: data.contrasena,
      })

      if (response.data?.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("token", response.data.token)
        setIntentosFallidos(0) // Resetear contador de intentos

        const userRole = response.data.user.id_rol
        if (userRole === 1) navigate("/administrador")
        else if (userRole === 2) navigate("/veterinario")
        else navigate("/propietario")
      } else {
        Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: response.data?.message || "Credenciales incorrectas",
          confirmButtonColor: "#e53935",
        })
      }
    } catch (error) {
      let mensaje = "Error al conectar con el servidor"
      
      if (error.response) {
        if (error.response.status === 401) {
          const intentosRestantes = error.response.data?.intentos_restantes || 3 - intentosFallidos - 1
          setIntentosFallidos(prev => prev + 1)
          mensaje = `Correo o contraseña incorrectos. ${intentosRestantes > 0 ? `Intentos restantes: ${intentosRestantes}` : 'Cuenta bloqueada.'}`
        } else if (error.response.status === 403 && error.response.data?.cuenta_bloqueada) {
          const tiempoRestante = error.response.data?.tiempo_restante || 2
          // Por esto:
          mensaje = `Cuenta bloqueada por demasiados intentos fallidos. ${tiempoRestante ? `Se desbloqueará en ${tiempoRestante} horas. ` : ''}Contacte al administrador para ayuda.` 
        } else {
          mensaje = error.response.data?.message || "Hubo un problema, intenta nuevamente"
        }
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonColor: "#e53935",
      })
    }
    reset()
  }

  return (
    <main className="login-main">
      <div className="iz-side">
        <div className="logo-container">
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/logo.png"
              alt="Logo de Akeso"
              className="login-logo"
            />
          </Link>
        </div>
      </div>

      <div className="der-side">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <h1>Inicia Sesión</h1>

          <label>
            <strong>Email</strong>
            <div className="input-icon-container right">
              <input
                type="email"
                {...register("email", {
                  validate: validateEmail,
                })}
                className={`input-icon-field ${errors.email ? "input-error" : ""}`}
                placeholder="ejemplo@dominio.com"
              />
              <FaAt className="input-icon" />
            </div>
            {errors.email && (
              <p className="error-message1">
                {errors.email.message === "El email es obligatorio" && "Por favor, ingresa tu email"}
                {errors.email.message === "Falta el símbolo @ en el email" && "El email debe contener un @. Ejemplo: usuario@dominio.com"}
                {errors.email.message === "Falta el dominio después del @" && "Falta la parte después del @. Ejemplo: usuario@dominio.com"}
                {errors.email.message === "Falta el punto (.) en el dominio del email" && "El dominio debe contener un punto. Ejemplo: usuario@dominio.com"}
                {errors.email.message === "El formato del email no es válido" && "El formato del email no es válido. Por favor revisa"}
              </p>
            )}
          </label>

          <label>
            <strong>Contraseña</strong>
            <div className="input-icon-container right">
              <input
                type={showPassword ? "text" : "password"}
                {...register("contrasena", {
                  validate: validatePassword,
                })}
                className={`input-icon-field ${errors.contrasena ? "input-error" : ""}`}
                placeholder="Ingresa tu contraseña"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <span className="toggle-password-icon" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {passwordFocus && !errors.contrasena && (
              <div className="password-requirements">
                <p>La contraseña debe contener:</p>
                <ul>
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una mayúscula</li>
                  <li>Al menos una minúscula</li>
                  <li>Al menos un número</li>
                  <li>Al menos un carácter especial</li>
                </ul>
              </div>
            )}
            {errors.contrasena && (
              <p className="error-message1">
                {errors.contrasena.message}
              </p>
            )}
          </label>

          <button type="submit" className="login-submit-btn">
            Ingresar
          </button>

          <div className="extras">
            <p className="signup-link">
              ¿No tienes una cuenta? <Link to="/registrar">Regístrate</Link>
              <br />
              ¿Olvidaste tu contraseña? <Link to="/recuperar">Dale aqui</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}