"use client"

import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom" //Outlet renderiza las rutas hijas
import Loading from "../pages/Loading"

const PrivateRoutePropietario = () => {
  const [loading, setLoading] = useState(true) //muestra la carga mientras que se verifique que el usuario si es propietario
  const [autorizado, setAutorizado] = useState(false) //inicia falso pero cuando verifica  que si es propietario muestra el dashbord

  useEffect(() => {
    const verificarPropietario = async () => {
      const token = localStorage.getItem("token") // busca la informacion guardada en local y el token lo que hace es una identificacion
      if (!token) {
        setLoading(false) // detiene el proceso y no deja ingresar al usuario  a  la ruta privada porque no existe
        return
      }

      try {
        // Verificar si el usuario tiene el rol específico de propietario
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (user.id_rol !== 3) {
          // 3 es el rol de propietario
          setAutorizado(false)
          setLoading(false)
          return
        }

        const response = await fetch("http://localhost:5000/api/roles/verificar-propietario", {
          //llama la api verificar que esta en servidor
          headers: {
            //manda una cabecera la cual se llama authorization
            Authorization: `Bearer ${token}`, // en el token es un portador el cual dice verifica que estoy autorizado
          },
        })

        setAutorizado(response.ok) //valida si esta autorizado el usuario
      } catch (error) {
        console.error("Error al verificar propietario:", error) // si el servidor  no esta prendido o el token no es valido
      } finally {
        setLoading(false) //dejar de hacer la carga
      }
    }

    verificarPropietario() // verifica el token  si existe , lo valida en el backend,establecer si el usuario esta autorizado
  }, []) //solo se muestra una vez  el componente apenas se abre

  if (loading) return <Loading></Loading> // muestra el mensaje de cargando  mientras verifico

  return autorizado ? <Outlet /> : <Navigate to="/login" /> // si el autorizado cambia a  true  si no entonces lo devuelve al login
}

export default PrivateRoutePropietario
