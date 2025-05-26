const pool = require("../db/conexion")

const verificarAdministrador = async (req, res) => {
  console.log("=== VERIFICAR ADMINISTRADOR CONTROLLER ===")
  console.log("Usuario del token:", req.user)

  let connection
  try {
    const userId = req.user.id_usuario

    if (!userId) {
      console.log("❌ No se encontró id_usuario en el token")
      return res.status(403).json({
        success: false,
        message: "Token inválido: falta información del usuario",
      })
    }

    connection = await pool.getConnection()
    console.log("✅ Conexión a BD establecida")

    // Consultar el usuario y su rol desde la base de datos
    const query = "SELECT u.id_usuario, u.id_rol, u.email, u.nombre, u.apellido FROM usuarios u WHERE u.id_usuario = ?"
    console.log("Ejecutando query:", query, "con parámetro:", userId)

    const [userRows] = await connection.query(query, [userId])
    console.log("Resultado de la consulta:", userRows)

    if (userRows.length === 0) {
      console.log("❌ Usuario no encontrado en la base de datos")
      return res.status(403).json({
        success: false,
        message: "Usuario no encontrado",
        debug: {
          userId,
          queryExecuted: query,
        },
      })
    }

    const user = userRows[0]
    console.log("Usuario encontrado en BD:", user)

    // Verificar si el usuario es administrador (id_rol = 1)
    if (user.id_rol !== 1) {
      console.log(`❌ Usuario no es administrador. Rol actual: ${user.id_rol}`)
      return res.status(403).json({
        success: false,
        message: "Acceso denegado: se requiere rol de administrador",
        debug: {
          userRole: user.id_rol,
          requiredRole: 1,
          userId: user.id_usuario,
        },
      })
    }

    console.log("✅ Usuario verificado como administrador exitosamente")
    res.status(200).json({
      success: true,
      message: "Usuario es administrador",
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        id_rol: user.id_rol,
      },
    })
  } catch (err) {
    console.error("❌ Error al verificar administrador:", err)
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : "Error interno",
      debug: {
        errorType: err.name,
        errorMessage: err.message,
      },
    })
  } finally {
    if (connection) {
      connection.release()
      console.log("✅ Conexión a BD liberada")
    }
  }
}

const verificarPropietario = async (req, res) => {
  console.log("=== VERIFICAR PROPIETARIO CONTROLLER ===")
  let connection
  try {
    const userId = req.user.id_usuario
    console.log("Usuario ID:", userId)

    connection = await pool.getConnection()
    const [userRows] = await connection.query("SELECT id_rol FROM usuarios WHERE id_usuario = ?", [userId])

    if (userRows.length === 0) {
      console.log("❌ Usuario no encontrado en BD")
      return res.status(403).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    if (userRows[0].id_rol !== 3) {
      console.log("❌ Usuario no es propietario, rol:", userRows[0].id_rol)
      return res.status(403).json({
        success: false,
        message: "Acceso denegado: se requiere rol de propietario",
      })
    }

    console.log("✅ Usuario es propietario")
    res.status(200).json({
      success: true,
      message: "Usuario es propietario",
    })
  } catch (err) {
    console.error("❌ Error al verificar propietario:", err)
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    })
  } finally {
    if (connection) connection.release()
  }
}

const verificarVeterinario = async (req, res) => {
  console.log("=== VERIFICAR VETERINARIO CONTROLLER ===")
  let connection
  try {
    const userId = req.user.id_usuario
    console.log("Usuario ID:", userId)

    connection = await pool.getConnection()
    const [userRows] = await connection.query("SELECT id_rol FROM usuarios WHERE id_usuario = ?", [userId])

    if (userRows.length === 0) {
      console.log("❌ Usuario no encontrado en BD")
      return res.status(403).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    if (userRows[0].id_rol !== 2) {
      console.log("❌ Usuario no es veterinario, rol:", userRows[0].id_rol)
      return res.status(403).json({
        success: false,
        message: "Acceso denegado: se requiere rol de veterinario",
      })
    }

    console.log("✅ Usuario es veterinario")
    res.status(200).json({
      success: true,
      message: "Usuario es veterinario",
    })
  } catch (err) {
    console.error("❌ Error al verificar veterinario:", err)
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    })
  } finally {
    if (connection) connection.release()
  }
}

module.exports = {
  verificarPropietario,
  verificarAdministrador,
  verificarVeterinario,
}



