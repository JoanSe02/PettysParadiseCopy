const jwt = require("jsonwebtoken")

const JWT_SECRET = "tu_clave_secreta"

function authenticateToken(req, res, next) {
  console.log("=== MIDDLEWARE AUTHENTICATE TOKEN ===")
  console.log("Method:", req.method)
  console.log("URL:", req.url)
  console.log("Headers recibidos:", {
    authorization: req.headers["authorization"],
    "content-type": req.headers["content-type"],
    origin: req.headers["origin"],
  })

  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    console.log("❌ No token provided")
    console.log("Auth header:", authHeader)
    return res.status(401).json({
      success: false,
      message: "Token de acceso requerido",
      debug: {
        authHeader: authHeader,
        tokenExtracted: token,
      },
    })
  }

  console.log("Token recibido (primeros 20 chars):", token.substring(0, 20) + "...")

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message)
      console.log("Error details:", err)
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado",
        error: err.message,
        debug: {
          tokenProvided: !!token,
          errorType: err.name,
          errorMessage: err.message,
        },
      })
    }

    console.log("✅ Token decodificado exitosamente:")
    console.log("- id_usuario:", decoded.id_usuario)
    console.log("- email:", decoded.email)
    console.log("- id_rol:", decoded.id_rol)
    console.log("- exp:", new Date(decoded.exp * 1000))

    // Verificar que el token tenga los campos requeridos
    if (!decoded.id_usuario) {
      console.log("❌ Token missing id_usuario")
      return res.status(403).json({
        success: false,
        message: "Token inválido: falta id_usuario",
        debug: {
          decodedFields: Object.keys(decoded),
        },
      })
    }

    // Asignar información del usuario al request
    req.user = {
      id_usuario: decoded.id_usuario,
      id_rol: decoded.id_rol || null,
      email: decoded.email || null,
    }

    console.log("✅ Usuario asignado a req.user:", req.user)
    next()
  })
}

module.exports = authenticateToken

