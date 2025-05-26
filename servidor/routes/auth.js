const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../db/conexion")

const router = express.Router()

const JWT_SECRET = "tu_clave_secreta"
const JWT_EXPIRES_IN = "2h"

router.post("/login", async (req, res) => {
  let connection
  try {
    const { email, contrasena } = req.body

    if (!email || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      })
    }

    connection = await pool.getConnection()

    // Obtener usuario incluyendo los campos de bloqueo
    const [rows] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email])

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      })
    }

    const user = rows[0]

    // Verificar si la cuenta está bloqueada
    if (user.cuenta_bloqueada) {
      const [result] = await connection.query(
        "SELECT TIMESTAMPDIFF(HOUR, fecha_bloqueo, NOW()) AS horas_transcurridas FROM usuarios WHERE id_usuario = ?",
        [user.id_usuario],
      )

      const horasTranscurridas = result[0]?.horas_transcurridas || 0

      if (horasTranscurridas < 2) {
        const tiempoRestante = Math.ceil(2 - horasTranscurridas)
        return res.status(403).json({
          success: false,
          message: `Cuenta bloqueada. Intente nuevamente en ${tiempoRestante} hora(s).`,
          tiempo_restante: tiempoRestante,
          cuenta_bloqueada: true,
        })
      } else {
        // Desbloquear la cuenta después de 2 horas
        await connection.query(
          "UPDATE usuarios SET intentos_fallidos = 0, cuenta_bloqueada = 0, fecha_bloqueo = NULL WHERE id_usuario = ?",
          [user.id_usuario],
        )
        // Actualizar el objeto user para continuar con el login
        user.cuenta_bloqueada = 0
        user.intentos_fallidos = 0
      }
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena)

    if (!passwordMatch) {
      // Incrementar intentos fallidos
      const nuevosIntentos = (user.intentos_fallidos || 0) + 1

      if (nuevosIntentos >= 3) {
        // Bloquear la cuenta
        await connection.query(
          "UPDATE usuarios SET intentos_fallidos = ?, cuenta_bloqueada = 1, fecha_bloqueo = NOW() WHERE id_usuario = ?",
          [nuevosIntentos, user.id_usuario],
        )

        return res.status(403).json({
          success: false,
          message: "Cuenta bloqueada por demasiados intentos fallidos. Espere 2 horas o contacte al administrador.",
          cuenta_bloqueada: true,
          tiempo_restante: 2,
        })
      } else {
        // Actualizar intentos fallidos sin bloquear
        await connection.query("UPDATE usuarios SET intentos_fallidos = ? WHERE id_usuario = ?", [
          nuevosIntentos,
          user.id_usuario,
        ])

        return res.status(401).json({
          success: false,
          message: `Credenciales incorrectas. Intentos restantes: ${3 - nuevosIntentos}`,
          intentos_restantes: 3 - nuevosIntentos,
        })
      }
    }

    // Si la contraseña es correcta, resetear intentos fallidos
    if (user.intentos_fallidos > 0) {
      await connection.query(
        "UPDATE usuarios SET intentos_fallidos = 0, cuenta_bloqueada = 0, fecha_bloqueo = NULL WHERE id_usuario = ?",
        [user.id_usuario],
      )
    }

    // Crear token con información completa del usuario
    const tokenPayload = {
      id_usuario: user.id_usuario,
      email: user.email,
      id_rol: user.id_rol,
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Remover contraseña antes de enviar respuesta
    delete user.contrasena

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user,
    })
  } catch (error) {
    console.error("❌ Error en login:", error)
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message,
    })
  } finally {
    if (connection) connection.release()
  }
})

// Endpoint para desbloquear cuentas (solo administrador)
router.post("/desbloquear-cuenta", async (req, res) => {
  let connection
  try {
    const { email } = req.body
    const adminToken = req.headers.authorization?.split(" ")[1]

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Token de administrador requerido",
      })
    }

    // Verificar que el token pertenece a un administrador
    const decoded = jwt.verify(adminToken, JWT_SECRET)
    if (decoded.id_rol !== 1) {
      return res.status(403).json({
        success: false,
        message: "Solo los administradores pueden desbloquear cuentas",
      })
    }

    connection = await pool.getConnection()
    const [result] = await connection.query(
      "UPDATE usuarios SET intentos_fallidos = 0, cuenta_bloqueada = 0, fecha_bloqueo = NULL WHERE email = ?",
      [email],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    res.json({
      success: true,
      message: "Cuenta desbloqueada exitosamente",
    })
  } catch (error) {
    console.error("Error al desbloquear cuenta:", error)
    res.status(500).json({
      success: false,
      message: "Error al desbloquear la cuenta",
      error: error.message,
    })
  } finally {
    if (connection) connection.release()
  }
})

// Endpoint para verificar estado de bloqueo
router.get("/estado-cuenta/:email", async (req, res) => {
  let connection
  try {
    const { email } = req.params

    connection = await pool.getConnection()
    const [rows] = await connection.query(
      `SELECT 
        intentos_fallidos, 
        cuenta_bloqueada, 
        fecha_bloqueo,
        CASE 
          WHEN cuenta_bloqueada = 1 AND fecha_bloqueo IS NOT NULL 
          THEN TIMESTAMPDIFF(HOUR, fecha_bloqueo, NOW())
          ELSE NULL 
        END AS horas_transcurridas
      FROM usuarios WHERE email = ?`,
      [email],
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    const user = rows[0]
    const horasTranscurridas = user.horas_transcurridas || 0
    const tiempoRestante = user.cuenta_bloqueada ? Math.max(0, 2 - horasTranscurridas) : 0

    res.json({
      success: true,
      data: {
        intentos_fallidos: user.intentos_fallidos,
        cuenta_bloqueada: Boolean(user.cuenta_bloqueada),
        fecha_bloqueo: user.fecha_bloqueo,
        horas_transcurridas: horasTranscurridas,
        tiempo_restante: tiempoRestante,
      },
    })
  } catch (error) {
    console.error("Error al verificar estado de cuenta:", error)
    res.status(500).json({
      success: false,
      message: "Error al verificar estado de la cuenta",
      error: error.message,
    })
  } finally {
    if (connection) connection.release()
  }
})

router.post("/register", async (req, res) => {
  let connection
  try {
    const {
      tipo_doc,
      id_usuario,
      nombre,
      apellido,
      ciudad,
      direccion,
      telefono,
      fecha_nacimiento,
      email,
      contrasena,
      id_tipo = 1,
      id_rol = 3,
    } = req.body

    if (!email || !contrasena || !id_usuario || !nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: "Campos obligatorios faltantes",
      })
    }

    connection = await pool.getConnection()
    await connection.beginTransaction()

    const hashedPassword = await bcrypt.hash(contrasena, 10)
    await connection.query("CALL InsertarUsuarioYPropietario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      id_usuario,
      tipo_doc,
      nombre,
      apellido,
      ciudad,
      direccion,
      telefono,
      fecha_nacimiento,
      email,
      hashedPassword,
      id_tipo,
      id_rol,
    ])

    await connection.commit()

    res.status(201).json({
      success: true,
      message: "Usuario y propietario creados con éxito",
      userId: id_usuario,
    })
  } catch (error) {
    if (connection) await connection.rollback()
    console.error("Error en registro:", error)
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      error: error.message,
    })
  } finally {
    if (connection) connection.release()
  }
})

module.exports = router


