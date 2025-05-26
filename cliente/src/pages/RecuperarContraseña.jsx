"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import emailjs from "@emailjs/browser"
import { Link } from "react-router-dom"
import "../stylos/ResetPass.css"
import { useForm } from "react-hook-form"
import { BiShow, BiHide } from "react-icons/bi"

function RecuperarContraseña() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  })

  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  // Estados para el código OTP
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpRefs = useRef([])

  // Observar cambios en el campo email
  const emailValue = watch("email")

  useEffect(() => {
    if (emailValue) {
      setEmail(emailValue)
    }
  }, [emailValue])

  // Efecto para el cooldown del reenvío
  useEffect(() => {
    let interval
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const generateVerificationCode = () => {
    const length = 6
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let code = ""
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
  }

  const sendVerificationCode = async (emailToSend) => {
    const code = generateVerificationCode()
    setVerificationCode(code)

    return emailjs.send(
      "service_ay01elm",
      "template_g8zoojs",
      {
        email: emailToSend,
        passcode: code,
      },
      "Sp1XkzSo6_MvtBfUl",
    )
  }

  const handleSendCode = async (data) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/password/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (response.ok && result.exists) {
        await sendVerificationCode(data.email)

        Swal.fire({
          title: "Éxito",
          text: "Código enviado al correo",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        })
        setStep(2)
        setResendCooldown(60) // 60 segundos de cooldown
        reset()
      } else {
        Swal.fire("Error", "El correo electrónico no está registrado", "error")
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error)
      Swal.fire("Error", "Error de conexión con el servidor", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    setLoading(true)
    try {
      await sendVerificationCode(email)

      Swal.fire({
        title: "Éxito",
        text: "Código reenviado al correo",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      })
      setResendCooldown(60)
      setOtpValues(["", "", "", "", "", ""])
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus()
      }
    } catch (error) {
      console.error("Error al reenviar el código:", error)
      Swal.fire("Error", "No se pudo reenviar el código", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    // Solo permitir números y letras
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "")

    if (sanitizedValue.length <= 1) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = sanitizedValue
      setOtpValues(newOtpValues)

      // Auto-focus al siguiente campo
      if (sanitizedValue && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    // Manejar backspace
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }

    // Manejar flechas
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "")

    if (pastedData.length === 6) {
      const newOtpValues = pastedData.split("")
      setOtpValues(newOtpValues)
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerifyCode = () => {
    const enteredCode = otpValues.join("")

    if (enteredCode.length !== 6) {
      Swal.fire("Error", "Por favor ingrese el código completo", "error")
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (enteredCode === verificationCode) {
        Swal.fire({
          title: "Éxito",
          text: "Código verificado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        })
        setStep(3)
        reset()
      } else {
        Swal.fire("Error", "Código incorrecto", "error")
        setOtpValues(["", "", "", "", "", ""])
        otpRefs.current[0]?.focus()
      }
      setLoading(false)
    }, 1000)
  }

  const handleResetPassword = async (data) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/password/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nuevaContrasena: data.password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        Swal.fire({
          title: "Éxito",
          text: "Contraseña restablecida correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/login")
        })
        reset()
      } else {
        Swal.fire("Error", result.message || "Error al restablecer la contraseña", "error")
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de restablecimiento:", error)
      Swal.fire("Error", "Error de conexión con el servidor", "error")
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    return false
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Recuperar Contraseña"
      case 2:
        return "Verificar Código"
      case 3:
        return "Nueva Contraseña"
      default:
        return ""
    }
  }

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return "Escriba el correo vinculado con su cuenta para el restablecimiento de su contraseña"
      case 2:
        return "Ingrese el código de 6 dígitos enviado a su correo"
      case 3:
        return "Establezca su nueva contraseña"
      default:
        return ""
    }
  }

  return (
    <main className="recup-main">
      <div className="iz-side">
        <Link to="/">
          <img
            src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/logo.png"
            alt="Logo de Akeso"
            className="recup-logo"
          />
        </Link>
      </div>
      <div className="der-side1">
        <div className="recup-form1">
          <h1 className="form-title">{getStepTitle()}</h1>
          <div className="steps-indicator-container">
            <div className={`step-circle ${step === 1 ? "active" : ""}`}>1</div>
            <div className={`step-circle ${step === 2 ? "active" : ""}`}>2</div>
            <div className={`step-circle ${step === 3 ? "active" : ""}`}>3</div>
          </div>
          <p className="form-subtitle">{getStepSubtitle()}</p>

          {loading && (
            <div className="loading-overlay1">
              <div className="loading-spinner1"></div>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit(handleSendCode)}>
              <label>
                <strong>Email</strong>
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  className={errors.email ? "input-error1" : ""}
                  onPaste={handlePaste}
                />
                {errors.email && <p className="error-message3">{errors.email.message}</p>}
              </label>
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Código"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="otp-container">
                <label>
                  <strong>Código de Verificación</strong>
                </label>
                <div className="otp-inputs">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="otp-input"
                      maxLength={1}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="resend-container">
                <button
                  type="button"
                  className={`resend-button ${resendCooldown > 0 ? "disabled" : ""}`}
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                >
                  {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar código"}
                </button>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    setStep(1)
                    setOtpValues(["", "", "", "", "", ""])
                    setResendCooldown(0)
                  }}
                >
                  Atrás
                </button>
                <button
                  type="button"
                  className="login-submit-btn"
                  onClick={handleVerifyCode}
                  disabled={loading || otpValues.join("").length !== 6}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <label>
                <strong>Nueva Contraseña</strong>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/,
                        message: "Debe tener mayúscula, minúscula, número, carácter especial y sin espacios",
                      },
                    })}
                    className={errors.password ? "input-error" : ""}
                    onPaste={handlePaste}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: "#aaa" }}
                  >
                    {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
                  </span>
                </div>
                {errors.password && <p className="error-message3">{errors.password.message}</p>}
              </label>
              <label>
                <strong>Confirmar Contraseña</strong>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
                    })}
                    className={errors.confirmPassword ? "input-error" : ""}
                    onPaste={handlePaste}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: "#aaa" }}
                  >
                    {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="error-message3">{errors.confirmPassword.message}</p>}
              </label>
              <div className="button-group">
                <button type="button" className="back-button" onClick={() => setStep(2)}>
                  Atrás
                </button>
                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? "Nueva Clave..." : "Nueva Clave"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default RecuperarContraseña
