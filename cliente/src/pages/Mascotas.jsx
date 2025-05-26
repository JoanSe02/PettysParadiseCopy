"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import "../stylos/Mascotas.css"
import Swal from "sweetalert2"
import {
  PawPrint,
  Upload,
  User,
  Dog,
  Award,
  Calendar,
  Weight,
  CreditCard,
  UserIcon as Male,
  UserIcon as Female,
} from "lucide-react"

function FormularioMascota() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [imagePreview, setImagePreview] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Función para verificar que el servidor esté funcionando
  const checkServerHealth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/health", { timeout: 5000 })
      console.log("✅ Servidor funcionando:", response.data)
      return true
    } catch (error) {
      console.error("❌ Servidor no disponible:", error.message)
      return false
    }
  }

  // Función para subir imagen usando tu propio backend
  const uploadImageToCloudinary = async (file) => {
    setUploading(true)

    try {
      console.log("🔄 Verificando servidor...")

      // Verificar que el servidor esté funcionando
      const serverOk = await checkServerHealth()
      if (!serverOk) {
        throw new Error("El servidor no está disponible. Verifica que esté ejecutándose en el puerto 5000.")
      }

      console.log("🔄 Iniciando subida a través de tu backend...")

      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 Enviando archivo:", {
        name: file.name,
        size: file.size,
        type: file.type,
      })

      const response = await axios.post("http://localhost:5000/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`📊 Progreso de subida: ${percentCompleted}%`)
        },
      })

      console.log("✅ Respuesta del servidor:", response.data)

      if (response.data.success && response.data.url) {
        setImageUrl(response.data.url)

        Swal.fire({
          icon: "success",
          title: "¡Imagen subida!",
          text: "La foto se ha cargado correctamente",
          timer: 2000,
          showConfirmButton: false,
        })

        return response.data.url
      } else {
        throw new Error("Respuesta del servidor inválida")
      }
    } catch (error) {
      console.error("❌ Error detallado:", error)

      let errorMessage = "Error desconocido al subir la imagen"

      if (error.code === "ECONNABORTED") {
        errorMessage = "Tiempo de espera agotado. La imagen puede ser muy grande o la conexión es lenta."
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "No se pudo conectar con el servidor. Verifica que esté ejecutándose en el puerto 5000."
      } else if (error.response) {
        // Error del servidor
        const status = error.response.status
        const data = error.response.data

        switch (status) {
          case 400:
            errorMessage = data.error || "Archivo inválido o muy grande (máximo 5MB)"
            break
          case 404:
            errorMessage = "Ruta de upload no encontrada. Verifica la configuración del servidor."
            break
          case 500:
            errorMessage = data.error || "Error interno del servidor"
            break
          default:
            errorMessage = data.error || `Error del servidor (${status})`
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica que esté ejecutándose."
      } else if (error.message) {
        errorMessage = error.message
      }

      Swal.fire({
        icon: "warning",
        title: "Error al subir imagen",
        html: `
          <p>${errorMessage}</p>
          <br>
          <small>Puedes continuar sin imagen y agregarla después.</small>
        `,
        confirmButtonText: "Continuar sin imagen",
      })

      return null
    } finally {
      setUploading(false)
    }
  }

  // Función para manejar la imagen seleccionada
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validaciones del archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "Solo se permiten archivos JPG, PNG o WebP.",
      })
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Archivo muy grande",
        text: `La imagen debe ser menor a ${maxSize / (1024 * 1024)}MB. Tu archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      })
      return
    }

    // Mostrar preview inmediatamente
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)

    // Subir a Cloudinary a través de tu backend
    await uploadImageToCloudinary(file)
  }

  // Función para enviar el formulario
  const onSubmit = async (data) => {
    const mascotaData = {
      nom_mas: data.nom_mas,
      especie: data.especie,
      genero: data.genero,
      raza: data.raza,
      edad: Number.parseInt(data.edad),
      peso: Number.parseFloat(data.peso),
      id_pro: data.id_pro,
      foto: imageUrl || "",
    }

    console.log("📤 Enviando datos:", mascotaData)

    try {
      const response = await axios.post("http://localhost:5000/api/mascota/create", mascotaData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      })

      console.log("✅ Respuesta del servidor:", response.data)

      Swal.fire({
        title: "¡Mascota registrada!",
        html: `<strong>${data.nom_mas}</strong> ha sido registrada correctamente`,
        icon: "success",
        timer: 3000,
      })

      // Limpiar el formulario
      reset()
      setImagePreview(null)
      setImageUrl(null)
    } catch (error) {
      console.error("❌ Error en la solicitud:", error)

      let errorMessage = "Error al conectar con el servidor"

      if (error.code === "ECONNABORTED") {
        errorMessage = "Tiempo de espera agotado"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      }

      Swal.fire({
        icon: "error",
        title: "Error al registrar la mascota",
        text: errorMessage,
      })
    }
  }

  // El resto del JSX permanece igual...
  return (
    <div className="mascotas-container">
      <div className="left-panel">
        <div className="logo-container">
          <img src="https://raw.githubusercontent.com/Vale250910/mascotas_app1/main/img/logo.png" alt="Logo de Akeso" />
        </div>
        <div className="decoration-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <div className="icon-container">
              <PawPrint className="icon" />
            </div>
            <h1>Registro de Mascota</h1>
            <p>Completa los datos de tu mascota</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="image-upload-container">
              <label htmlFor="file-upload" className="image-upload-label">
                <div className="image-preview">
                  {imagePreview ? (
                    <img src={imagePreview || "/placeholder.svg"} alt="Foto de la mascota" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload className="upload-icon" />
                      <span>Subir foto (opcional)</span>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {uploading && <p className="uploading-text">Subiendo imagen...</p>}
            </div>

            {/* Resto de los campos del formulario */}
            <div className="form-group">
              <label className="form-label">
                <User className="field-icon" />
                <span>Nombre</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombre de tu mascota"
                {...register("nom_mas", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
              />
              {errors.nom_mas && <p className="error-message3">{errors.nom_mas.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Dog className="field-icon" />
                <span>Especie</span>
              </label>
              <select
                className="form-input"
                {...register("especie", {
                  required: "La especie es obligatoria",
                })}
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Hamster">Hamster</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.especie && <p className="error-message3">{errors.especie.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Male className="field-icon" />
                <span>Género</span>
              </label>
              <div className="gender-options">
                <label className="gender-option">
                  <input
                    type="radio"
                    value="Macho"
                    {...register("genero", {
                      required: "El género es obligatorio",
                    })}
                  />
                  <div className="gender-radio-button">
                    <Male className="gender-icon male-icon" />
                    <span>Macho</span>
                  </div>
                </label>
                <label className="gender-option">
                  <input
                    type="radio"
                    value="Hembra"
                    {...register("genero", {
                      required: "El género es obligatorio",
                    })}
                  />
                  <div className="gender-radio-button">
                    <Female className="gender-icon female-icon" />
                    <span>Hembra</span>
                  </div>
                </label>
              </div>
              {errors.genero && <p className="error-message3">{errors.genero.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award className="field-icon" />
                <span>Raza</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Raza de tu mascota"
                {...register("raza", {
                  required: "La raza es obligatoria",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
              />
              {errors.raza && <p className="error-message3">{errors.raza.message}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="field-icon" />
                  <span>Edad (años)</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Edad"
                  {...register("edad", {
                    required: "La edad es obligatoria",
                    min: { value: 0, message: "La edad no puede ser negativa" },
                    max: { value: 30, message: "No puede ser mayor a 30 años" },
                  })}
                />
                {errors.edad && <p className="error-message3">{errors.edad.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Weight className="field-icon" />
                  <span>Peso (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="Peso"
                  {...register("peso", {
                    required: "El peso es obligatorio",
                    min: { value: 0.1, message: "Debe ser mayor a 0 kg" },
                    max: { value: 200, message: "No puede ser mayor a 200 kg" },
                  })}
                />
                {errors.peso && <p className="error-message3">{errors.peso.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <CreditCard className="field-icon" />
                <span>Número de documento del propietario</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Número de documento"
                {...register("id_pro", {
                  required: "La cédula es obligatoria",
                  minLength: { value: 7, message: "Mínimo 7 caracteres" },
                  maxLength: { value: 15, message: "Máximo 15 caracteres" },
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                })}
              />
              {errors.id_pro && <p className="error-message3">{errors.id_pro.message}</p>}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={uploading}>
                {uploading ? "Subiendo imagen..." : "Registrar Mascota"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  reset()
                  setImagePreview(null)
                  setImageUrl(null)
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioMascota

