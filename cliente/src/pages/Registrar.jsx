"use client"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Axios from "axios"
import Swal from "sweetalert2"
import { PawPrint, User, AtSign, Lock, Phone, Calendar, FileText, Building, Home, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "../stylos/Registrar.css"
import "bootstrap-icons/font/bootstrap-icons.css"

export default function Registrar() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    trigger,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      isPropietario: true, // Valor por defecto siempre true
    },
  })

  const [step, setStep] = useState(1)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Estado para mostrar/ocultar contraseña
  const password = watch("contrasena")
  const email = watch("email")

  const onSubmit = (data) => {
    addUsuario(data)
    reset()
    setStep(1)
  }

  const addUsuario = (data) => {
    Axios.post("http://localhost:5000/api/auth/register", {
      tipo_doc: data.tipo_doc,
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      apellido: data.apellido,
      ciudad: data.ciudad,
      direccion: data.direccion,
      telefono: data.telefono,
      fecha_nacimiento: data.fecha_nacimiento,
      email: data.email,
      contrasena: data.contrasena,
      id_tipo: data.id_tipo || 1,
      id_rol: data.id_rol || 3,
      isPropietario: true, // Valor por defecto para Propietario
    })
      .then((response) => {
        Swal.fire({
          title: "<strong>Registro exitoso!</strong>",
          html: `<i>El usuario <strong>${data.nombre}</strong> fue registrado con éxito!</i>`,
          icon: "success",
          timer: 3000,
        })

        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate("/login")
        }, 3000)

        reset()
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "¡Usuario ya registrado!",
          html: `El correo <strong>${data.email}</strong> y el ID <strong>${data.id_usuario}</strong> ya están registrados.`,
          confirmButtonColor: "#d33",
        })
      })
  }
  const nextStep = async () => {
    let isValid = false

    if (step === 1) {
      isValid = await trigger(["tipo_doc", "id_usuario", "nombre", "apellido"])
    } else if (step === 2) {
      isValid = await trigger(["ciudad", "direccion", "telefono", "fecha_nacimiento"])
    } else if (step === 3) {
      isValid = await trigger(["email", "password", "id_tipo", "id_rol"])
    }

    if (isValid) {
      setStep(step + 1)
    }
  }
  const [generatedAddress, setGeneratedAddress] = useState("")

  const tipoVia = watch("tipoVia")
  const numeroPrincipal = watch("numeroPrincipal")
  const numeroSecundario = watch("numeroSecundario")
  const numeroAdicional = watch("numeroAdicional")

  const tiposVia = ["Carrera", "Calle", "Avenida", "Diagonal", "Transversal", "Circular", "Autopista", "Kilometro"]

  // Función para validar tipo de vía en onChange
  const onChangeTipoVia = async (e) => {
    const value = e.target.value
    setValue("tipoVia", value)

    // Validar inmediatamente el campo
    await trigger("tipoVia")

    // Si hay otros campos llenos, regenerar la dirección automáticamente
    if (value && numeroPrincipal) {
      generarDireccion()
    }
  }

  const generarDireccion = async () => {
    // Validar campos obligatorios usando trigger
    const isValidTipoVia = await trigger("tipoVia")
    const isValidNumeroPrincipal = await trigger("numeroPrincipal")
    const isValidNumeroSecundario = await trigger("numeroSecundario")

    // Verificar que los campos obligatorios estén presentes y válidos
    if (isValidTipoVia && isValidNumeroPrincipal && tipoVia && numeroPrincipal) {
      let direccion = `${tipoVia} ${numeroPrincipal}`

      // Validar y agregar número secundario si está presente
      if (numeroSecundario) {
        if (isValidNumeroSecundario) {
          direccion += ` # ${numeroSecundario}`

          if (numeroAdicional) {
            direccion += `-${numeroAdicional}`
          }
        } else {
          // Si el número secundario no es válido, mostrar error y no generar dirección
          return
        }
      }

      setGeneratedAddress(direccion)
      setValue("direccion", direccion)

      // Trigger validation para el campo de dirección después de generar
      trigger("direccion")
    }
  }

  return (
    <main className="register-main">
      <div className="iz-side">
        <div className="logo-container">
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/refs/heads/main/img/logo.png"
              alt="Logo de Akeso"
              className="regis-logo"
            />
          </Link>
        </div>
      </div>

      <div className="der-side">
        <div className="register-container">
          <div className="form-container1">
            <div className="form-header1">
              <div className="icon-container1">
                <PawPrint className="icon-paw" />
              </div>
              <h1>{step === 1 ? "Información Personal" : step === 2 ? "Información de Contacto" : "Credenciales"}</h1>
              <p>Paso {step} de 3</p>
            </div>

            <div className="form-body">
              <form onSubmit={handleSubmit(onSubmit)} id="signup-form">
                {/* Paso 1: Información personal */}
                {step === 1 && (
                  <>
                    <div className="form-group">
                      <div className="label-container">
                        <FileText className="icon-small" />
                        <label>Tipo de documento</label>
                      </div>
                      <select {...register("tipo_doc", { required: "El tipo de documento es obligatorio." })}>
                        <option value="">Seleccione un tipo</option>
                        <option value="C.C">C.C</option>
                        <option value="C.E">C.E</option>
                      </select>
                      {errors.tipo_doc && <span className="error-message1">{errors.tipo_doc.message}</span>}
                    </div>

                    <div className="form-group">
                      <div className="label-container">
                        <FileText className="icon-small" />
                        <label>Cédula</label>
                      </div>
                      <input
                        type="text"
                        {...register("id_usuario", {
                          required: "La cédula es obligatoria.",
                          minLength: { value: 7, message: "Mínimo 7 caracteres." },
                          maxLength: { value: 12, message: "Máximo 12 caracteres." },
                          pattern: { value: /^[0-9]+$/, message: "Solo números." },
                        })}
                        onKeyDown={(e) => {
                          // Permitir: teclas de control (backspace, delete, tab, etc.)
                          if (
                            ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                          ) {
                            return
                          }
                          // Prevenir entrada si no es un número
                          if (e.key < "0" || e.key > "9") {
                            e.preventDefault()
                          }
                        }}
                        onPaste={(e) => {
                          // Prevenir pegar texto no numérico
                          const pasteData = e.clipboardData.getData("text/plain")
                          if (!/^\d+$/.test(pasteData)) {
                            e.preventDefault()
                          }
                        }}
                        placeholder="Escribe tu número de documento"
                        inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                      />
                      {errors.id_usuario && <span className="error-message1">{errors.id_usuario.message}</span>}
                    </div>

                    <div className="form-group">
                      <div className="label-container">
                        <User className="icon-small" />
                        <label>Nombre</label>
                      </div>
                      <input
                        type="text"
                        {...register("nombre", {
                          required: "El nombre es obligatorio.",
                          minLength: { value: 3, message: "Mínimo 3 caracteres." },
                          maxLength: { value: 50, message: "Máximo 50 caracteres." },
                          pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/, message: "Solo letras y espacios." },
                        })}
                        onKeyDown={(e) => {
                          // Permitir teclas de control
                          if (
                            [
                              "Backspace",
                              "Delete",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                              "Space",
                              " ",
                            ].includes(e.key)
                          ) {
                            return
                          }

                          // Permitir letras (incluye acentos cuando se usan combinaciones de teclas)
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault()
                          }
                        }}
                        onPaste={(e) => {
                          const pasteData = e.clipboardData.getData("text/plain")
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(pasteData)) {
                            e.preventDefault()
                            alert("Solo se permiten letras y espacios")
                          }
                        }}
                        placeholder="Escribe tu nombre"
                      />
                      {errors.nombre && <span className="error-message1">{errors.nombre.message}</span>}
                    </div>

                    <div className="form-group">
                      <div className="label-container">
                        <User className="icon-small" />
                        <label>Apellido</label>
                      </div>
                      <input
                        type="text"
                        {...register("apellido", {
                          required: "El apellido es obligatorio.",
                          minLength: { value: 3, message: "Mínimo 3 caracteres." },
                          maxLength: { value: 50, message: "Máximo 50 caracteres." },
                          pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/, message: "Solo letras y espacios." },
                        })}
                        onKeyDown={(e) => {
                          // Permitir teclas de control
                          if (
                            [
                              "Backspace",
                              "Delete",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                              "Space",
                              " ",
                            ].includes(e.key)
                          ) {
                            return
                          }

                          // Permitir letras (incluye acentos cuando se usan combinaciones de teclas)
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault()
                          }
                        }}
                        onPaste={(e) => {
                          const pasteData = e.clipboardData.getData("text/plain")
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(pasteData)) {
                            e.preventDefault()
                            alert("Solo se permiten letras y espacios")
                          }
                        }}
                        placeholder="Escribe tu apellido"
                      />
                      {errors.apellido && <span className="error-message1">{errors.apellido.message}</span>}
                    </div>
                  </>
                )}

                {/* Paso 2: Contacto */}
                {step === 2 && (
                  <>
                    <div className="form-group">
                      <div className="label-container">
                        <Building className="icon-small" />
                        <label>Ciudad</label>
                      </div>
                      <input
                        type="text"
                        {...register("ciudad", {
                          required: "La ciudad es obligatoria.",
                          pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/, message: "Solo letras y espacios." },
                          minLength: { value: 5, message: "Mínimo 5 caracteres." },
                          maxLength: { value: 100, message: "Máximo 100 caracteres." },
                        })}
                        onKeyDown={(e) => {
                          // Permitir teclas de control
                          if (
                            [
                              "Backspace",
                              "Delete",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                              "Space",
                              " ",
                            ].includes(e.key)
                          ) {
                            return
                          }

                          // Permitir letras (incluye acentos cuando se usan combinaciones de teclas)
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault()
                          }
                        }}
                        onPaste={(e) => {
                          const pasteData = e.clipboardData.getData("text/plain")
                          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(pasteData)) {
                            e.preventDefault()
                            alert("Solo se permiten letras y espacios")
                          }
                        }}
                        placeholder="Escribe tu ciudad"
                      />
                      {errors.ciudad && <span className="error-message1">{errors.ciudad.message}</span>}
                    </div>

                    <div className="address-section">
                      <div className="address-section-title">
                        <Home className="icon" />
                        <h3>Generador de Dirección</h3>
                      </div>

                      <div className="address-grid">
                        <div className="address-field">
                          <label htmlFor="tipoVia">
                            <Home className="field-icon" />
                            Tipo de vía:
                          </label>
                          <select
                            {...register("tipoVia", {
                              required: "El tipo de vía es obligatorio para generar la dirección",
                            })}
                            onChange={onChangeTipoVia}
                          >
                            <option value="">Seleccionar</option>
                            {tiposVia.map((tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo}
                              </option>
                            ))}
                          </select>
                          {errors.tipoVia && <span className="address-error-message">{errors.tipoVia.message}</span>}
                        </div>

                        <div className="address-field">
                          <label htmlFor="numeroPrincipal">Número principal:</label>
                          <input
                            id="numeroPrincipal"
                            type="text"
                            {...register("numeroPrincipal", {
                              required: "El número principal es obligatorio para generar la dirección",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Solo se permiten números",
                              },
                              minLength: {
                                value: 1,
                                message: "Mínimo 1 dígito",
                              },
                              maxLength: {
                                value: 4,
                                message: "Máximo 4 dígitos",
                              },
                            })}
                            onKeyDown={(e) => {
                              if (
                                ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                              ) {
                                return
                              }
                              if (e.key < "0" || e.key > "9") {
                                e.preventDefault()
                              }
                            }}
                            onPaste={(e) => {
                              const pasteData = e.clipboardData.getData("text/plain")
                              if (!/^\d+$/.test(pasteData)) {
                                e.preventDefault()
                              }
                            }}
                            onChange={async (e) => {
                              setValue("numeroPrincipal", e.target.value)
                              await trigger("numeroPrincipal")
                              if (tipoVia && e.target.value) {
                                generarDireccion()
                              }
                            }}
                            placeholder="12"
                            inputMode="numeric"
                          />
                          {errors.numeroPrincipal && (
                            <span className="address-error-message">{errors.numeroPrincipal.message}</span>
                          )}
                        </div>

                        <div className="address-field">
                          <label htmlFor="numeroSecundario">Número secundario:</label>
                          <input
                            id="numeroSecundario"
                            type="text"
                            {...register("numeroSecundario", {
                              required: "El número secundario es obligatorio para generar la dirección",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Solo se permiten números",
                              },
                              minLength: {
                                value: 1,
                                message: "Mínimo 1 dígito",
                              },
                              maxLength: {
                                value: 4,
                                message: "Máximo 4 dígitos",
                              },
                            })}
                            onKeyDown={(e) => {
                              if (
                                ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                              ) {
                                return
                              }
                              if (e.key < "0" || e.key > "9") {
                                e.preventDefault()
                              }
                            }}
                            onPaste={(e) => {
                              const pasteData = e.clipboardData.getData("text/plain")
                              if (!/^\d+$/.test(pasteData)) {
                                e.preventDefault()
                              }
                            }}
                            onChange={async (e) => {
                              setValue("numeroSecundario", e.target.value)
                              await trigger("numeroSecundario")
                              if (tipoVia && numeroPrincipal && e.target.value) {
                                generarDireccion()
                              }
                            }}
                            placeholder="45"
                            inputMode="numeric"
                          />
                          {errors.numeroSecundario && (
                            <span className="address-error-message">{errors.numeroSecundario.message}</span>
                          )}
                        </div>

                        <div className="address-field">
                          <label htmlFor="numeroAdicional">Número adicional:</label>
                          <input
                            id="numeroAdicional"
                            type="text"
                            {...register("numeroAdicional", {
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Solo se permiten números",
                              },
                              maxLength: {
                                value: 4,
                                message: "Máximo 4 dígitos",
                              },
                            })}
                            onKeyDown={(e) => {
                              if (
                                ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                              ) {
                                return
                              }
                              if (e.key < "0" || e.key > "9") {
                                e.preventDefault()
                              }
                            }}
                            onPaste={(e) => {
                              const pasteData = e.clipboardData.getData("text/plain")
                              if (!/^\d+$/.test(pasteData)) {
                                e.preventDefault()
                              }
                            }}
                            onChange={async (e) => {
                              setValue("numeroAdicional", e.target.value)
                              await trigger("numeroAdicional")
                              if (tipoVia && numeroPrincipal && numeroSecundario) {
                                generarDireccion()
                              }
                            }}
                            placeholder="45"
                            inputMode="numeric"
                          />
                          {errors.numeroAdicional && (
                            <span className="address-error-message">{errors.numeroAdicional.message}</span>
                          )}
                        </div>
                      </div>

                      <div className="generate-address-container">
                        <button type="button" onClick={generarDireccion} className="generate-address-btn">
                          Generar Dirección
                        </button>
                      </div>

                      {generatedAddress && (
                        <div className="generated-address-container">
                          <label className="generated-address-label">Dirección generada:</label>
                          <div className="generated-address-display">{generatedAddress}</div>
                        </div>
                      )}

                      <div className="manual-address-field">
                        <div className="label-container">
                          <Home className="icon-small" />
                          <label>Dirección</label>
                        </div>
                        <input
                          type="text"
                          {...register("direccion", {
                            required: "La dirección es obligatoria.",
                            minLength: { value: 10, message: "Mínimo 10 caracteres." },
                            maxLength: { value: 200, message: "Máximo 200 caracteres." },
                            pattern: {
                              value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#\-.,]+$/,
                              message:
                                "Solo se permiten letras, números, espacios y caracteres especiales (#, -, ., ,)",
                            },
                            validate: {
                              noOnlySpaces: (value) =>
                                value.trim().length > 0 || "La dirección no puede contener solo espacios",
                              validFormat: (value) => {
                                const trimmedValue = value.trim()
                                // Verificar que tenga al menos una letra y un número
                                const hasLetter = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(trimmedValue)
                                const hasNumber = /[0-9]/.test(trimmedValue)
                                return (
                                  (hasLetter && hasNumber) ||
                                  "La dirección debe contener al menos una letra y un número"
                                )
                              },
                            },
                          })}
                          onKeyDown={(e) => {
                            // Permitir teclas de control
                            if (
                              [
                                "Backspace",
                                "Delete",
                                "Tab",
                                "ArrowLeft",
                                "ArrowRight",
                                "Home",
                                "End",
                                "Space",
                                " ",
                              ].includes(e.key)
                            ) {
                              return
                            }

                            // Permitir letras, números y caracteres especiales válidos para direcciones
                            if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ#\-.,]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                              e.preventDefault()
                            }
                          }}
                          onPaste={(e) => {
                            const pasteData = e.clipboardData.getData("text/plain")
                            if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#\-.,]+$/.test(pasteData)) {
                              e.preventDefault()
                              alert("Solo se permiten letras, números, espacios y caracteres especiales (#, -, ., ,)")
                            }
                          }}
                          onChange={(e) => {
                            // Limpiar la dirección generada si el usuario empieza a escribir manualmente
                            if (e.target.value !== generatedAddress) {
                              setGeneratedAddress("")
                            }
                          }}
                          placeholder="Escribe tu dirección completa o usa el generador"
                        />
                        {errors.direccion && <span className="error-message1">{errors.direccion.message}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="label-container">
                        <Phone className="icon-small" />
                        <label>Teléfono</label>
                      </div>
                      <input
                        type="tel"
                        {...register("telefono", {
                          required: "El teléfono es obligatorio.",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Solo se admiten números y debe tener 10 dígitos.",
                          },
                        })}
                        onKeyDown={(e) => {
                          // Permitir: teclas de control (backspace, delete, tab, etc.)
                          if (
                            ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                          ) {
                            return
                          }
                          // Prevenir entrada si no es un número
                          if (e.key < "0" || e.key > "9") {
                            e.preventDefault()
                          }
                        }}
                        onPaste={(e) => {
                          // Prevenir pegar texto no numérico
                          const pasteData = e.clipboardData.getData("text/plain")
                          if (!/^\d+$/.test(pasteData)) {
                            e.preventDefault()
                          }
                        }}
                        placeholder="Escribe tu teléfono"
                        inputMode="numeric"
                      />
                      {errors.telefono && <span className="error-message1">{errors.telefono.message}</span>}
                    </div>

                    <div className="form-group">
                      <div className="label-container">
                        <Calendar className="icon-small" />
                        <label>Fecha de nacimiento</label>
                      </div>
                      <input
                        type="date"
                        {...register("fecha_nacimiento", {
                          required: "La fecha de nacimiento es obligatoria.",
                          validate: (value) => {
                            const fecha_nacimiento = new Date(value)
                            const hoy = new Date()
                            let edad = hoy.getFullYear() - fecha_nacimiento.getFullYear()
                            const mes = hoy.getMonth() - fecha_nacimiento.getMonth()
                            if (mes < 0 || (mes === 0 && hoy.getDate() < fecha_nacimiento.getDate())) {
                              edad--
                            }
                            return edad >= 18 || "Debes ser mayor de 18 años."
                          },
                        })}
                      />
                      {errors.fecha_nacimiento && (
                        <span className="error-message1">{errors.fecha_nacimiento.message}</span>
                      )}
                    </div>
                  </>
                )}

                {/* Paso 3: Credenciales */}
                {step === 3 && (
                  <>
                    <div className="form-group">
                      <div className="label-container">
                        <AtSign className="icon-small" />
                        <label>Correo electrónico</label>
                      </div>
                      <input
                        type="email"
                        {...register("email", {
                          required: "El email es obligatorio",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                          },
                        })}
                        placeholder="tu@correo.com"
                      />
                      {errors.email && <span className="error-message1">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                      <div className="label-container">
                        <Lock className="icon-small" />
                        <label>Contraseña</label>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("contrasena", {
                            required: "La contraseña es obligatoria",
                            pattern: {
                              value:
                                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/,
                              message: "Debe tener mayúscula, minúscula, número, carácter especial y sin espacios",
                            },
                          })}
                          onPaste={(e) => {
                            e.preventDefault()
                            return false
                          }}
                          placeholder="Crea una contraseña segura"
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "16px",
                            transform: "translateY(-50%)",
                            color: "#99a3a4",
                            fontSize: "18px",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>
                      {errors.contrasena && <span className="error-message1">{errors.contrasena.message}</span>}

                      {/* Campo para confirmar contraseña */}
                      <div className="label-container" style={{ marginTop: "16px" }}>
                        <Lock className="icon-small" />
                        <label>Confirmar Contraseña</label>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmarContrasena", {
                            required: "Por favor confirma tu contraseña",
                            pattern: {
                              value:
                                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/,
                              message: "Debe tener mayúscula, minúscula, número, carácter especial y sin espacios",
                            },
                            validate: (value) => value === getValues("contrasena") || "Las contraseñas no coinciden",
                          })}
                          onPaste={(e) => {
                            e.preventDefault()
                            return false
                          }}
                          placeholder="Repite tu contraseña"
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "16px",
                            transform: "translateY(-50%)",
                            color: "#99a3a4",
                            fontSize: "18px",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>
                      {errors.confirmarContrasena && (
                        <span className="error-message1">{errors.confirmarContrasena.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <select
                        {...register("id_tipo", { required: "El tipo de usuario es obligatorio." })}
                        defaultValue="1"
                        style={{ display: "none" }}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="1">Invitado/Tutor</option>
                        <option value="2">Medico</option>
                        <option value="3">Auxiliar Veterinario</option>
                        <option value="4">Administrativo</option>
                      </select>
                      {errors.id_tipo && <span className="error-message1">{errors.id_tipo.message}</span>}
                    </div>
                    <div className="form-group">
                      <select
                        {...register("id_rol", { required: "El tipo de usuario es obligatorio." })}
                        defaultValue="3"
                        style={{ display: "none" }}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="1">Administrador</option>
                        <option value="2">Veterinario</option>
                        <option value="3">Propietario</option>
                      </select>
                      {errors.id_rol && <span className="error-message1">{errors.id_rol.message}</span>}
                    </div>
                    <input type="hidden" {...register("isPropietario")} value="true" />
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="terms"
                        {...register("terms", { required: "Debes aceptar los términos y condiciones" })}
                      />
                      <label htmlFor="terms">Acepto los términos y condiciones</label>
                      {errors.terms && <span className="error-message1">{errors.terms.message}</span>}
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="form-footer">
              <div className="button-container">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="button button-prev">
                    Anterior
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="button button-next">
                    Siguiente
                  </button>
                ) : (
                  <button type="submit" form="signup-form" className="button button-submit">
                    Crear cuenta
                  </button>
                )}
              </div>
              <p className="login-link">
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

