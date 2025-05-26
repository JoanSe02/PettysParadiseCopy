"use client"

import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../pages/Loading"

const PrivateRouteVeterinario = () => {
  const [loading, setLoading] = useState(true)
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    const verificarVeterinario = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Verificar si el usuario tiene el rol específico de veterinario
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        console.log("Usuario verificando veterinario:", user) // Debug

        if (user.id_rol !== 2) {
          // 2 es el rol de veterinario
          console.log("Usuario no es veterinario, rol:", user.id_rol) // Debug
          setAutorizado(false)
          setLoading(false)
          return
        }

        const response = await fetch("http://localhost:5000/api/roles/verificar-veterinario", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Respuesta verificación veterinario:", response.status) // Debug
        setAutorizado(response.ok)
      } catch (error) {
        console.error("Error al verificar veterinario:", error)
      } finally {
        setLoading(false)
      }
    }

    verificarVeterinario()
  }, [])

  if (loading) return <Loading />

  return autorizado ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRouteVeterinario
