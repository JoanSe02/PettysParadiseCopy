"use client"

import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../pages/Loading"
import axios from "axios"
import debugAuth from "../pages/debug_auth"

const PrivateRouteAdministrador = () => {
  const [loading, setLoading] = useState(true)
  const [autorizado, setAutorizado] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const verificarAdministrador = async () => {
      try {
        console.log("=== INICIANDO VERIFICACIÓN DE ADMINISTRADOR ===")

        // 1. Verificar localStorage
        const { token, user: userStr } = debugAuth.checkLocalStorage()

        if (!token || !userStr) {
          console.log("❌ No hay token o usuario en localStorage")
          if (isMounted) {
            setAutorizado(false)
            setError("No hay sesión activa")
          }
          return
        }

        // 2. Parsear usuario
        let user
        try {
          user = JSON.parse(userStr)
          console.log("✅ Usuario parseado correctamente:", user)
        } catch (e) {
          console.log("❌ Error parseando usuario:", e)
          if (isMounted) {
            setAutorizado(false)
            setError("Datos de usuario corruptos")
          }
          return
        }

        // 3. Verificación rápida de rol en frontend (opcional)
        console.log("Verificando rol del usuario:", user.id_rol)
        if (user.id_rol !== 1) {
          console.log("❌ Usuario no es administrador según localStorage")
          if (isMounted) {
            setAutorizado(false)
            setError(`Acceso denegado: rol actual ${user.id_rol}, se requiere rol 1`)
          }
          return
        }

        // 4. Verificación real con el backend
        console.log("✅ Haciendo petición de verificación al backend...")

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 segundos de timeout
        }

        const response = await axios.get(
          "http://localhost:5000/api/roles/verificar-administrador", 
          config
        )

        console.log("✅ Respuesta exitosa del servidor:", response.data)

        if (isMounted) {
          if (response.data.success) {
            setAutorizado(true)
            setError(null)
            console.log("✅ Usuario autorizado como administrador")
          } else {
            setAutorizado(false)
            setError(response.data.message || "Verificación fallida")
          }
        }
      } catch (error) {
        console.error("❌ Error en verificación:", error)

        if (isMounted) {
          setAutorizado(false)

          if (error.response) {
            const status = error.response.status
            const serverMessage = error.response.data?.message || "Error del servidor"

            console.log("❌ Error del servidor:")
            console.log("Status:", status)
            console.log("Response data:", error.response.data)

            if (status === 401) {
              setError("Token inválido o expirado")
              localStorage.removeItem("token")
              localStorage.removeItem("user")
            } else if (status === 403) {
              setError("Acceso denegado: permisos insuficientes")
            } else if (status === 404) {
              setError("Endpoint no encontrado - verifica la configuración del servidor")
            } else {
              setError(`Error del servidor (${status}): ${serverMessage}`)
            }
          } else if (error.request) {
            setError("Error de conexión. Verifica que el servidor esté funcionando")
          } else {
            setError("Error inesperado durante la verificación")
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    verificarAdministrador()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <Loading fullPage={true} />
  }

  if (!autorizado) {
    console.log("❌ Redirigiendo a login. Error:", error)
    return <Navigate to="/login" replace state={{ error }} />
  }

  return <Outlet />
}

export default PrivateRouteAdministrador



