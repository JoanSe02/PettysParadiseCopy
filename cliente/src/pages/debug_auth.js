// Utilidad para debugging de autenticación
const debugAuth = {
  // Verificar token en localStorage
  checkLocalStorage() {
    console.log("=== DEBUG: VERIFICANDO LOCALSTORAGE ===")

    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    console.log("Token existe:", !!token)
    console.log("User existe:", !!user)

    if (token) {
      console.log("Token (primeros 50 chars):", token.substring(0, 50) + "...")

      // Decodificar token JWT manualmente (solo para debugging)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log("Token payload:", payload)
        console.log("Token expira:", new Date(payload.exp * 1000))
        console.log("Token válido:", payload.exp * 1000 > Date.now())
      } catch (e) {
        console.error("Error decodificando token:", e)
      }
    }

    if (user) {
      const userData = JSON.parse(user)
      console.log("User data:", userData)
      console.log("User role:", userData.id_rol)
    }

    return { token, user }
  },

  // Verificar headers de la petición
  checkRequestHeaders(token) {
    console.log("=== DEBUG: VERIFICANDO HEADERS ===")

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    console.log("Headers a enviar:", headers)
    return headers
  },

  // Test de conectividad
  async testConnection() {
    console.log("=== DEBUG: TEST DE CONECTIVIDAD ===")

    try {
      const response = await fetch("http://localhost:5000/api/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Servidor responde:", response.status)
      return response.ok
    } catch (error) {
      console.error("Error de conectividad:", error)
      return false
    }
  },
}

export default debugAuth
