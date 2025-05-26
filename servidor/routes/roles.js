const express = require('express')
const router = express.Router()
const pool = require('../database') // Asegúrate de que la ruta sea correcta

// Middleware de autenticación (deberías importarlo)
const { authenticateToken } = require('../middlewares/authenticateToken') // Ajusta la ruta según tu estructura

/**
 * Endpoint para verificar si un usuario es propietario
 */
router.get("/verificar-propietario", authenticateToken, async (req, res) => {
  let connection
  try {
    const userId = req.user.id_usuario

    connection = await pool.getConnection()

    // Primero verificar el rol del usuario
    const [userRows] = await connection.query("SELECT id_rol FROM usuarios WHERE id_usuario = ?", [userId])

    if (userRows.length === 0) {
      return res.sendStatus(403) // Usuario no encontrado
    }

    // Si el usuario no tiene rol de propietario (id_rol = 3), denegar acceso
    if (userRows[0].id_rol !== 3) {
      return res.sendStatus(403) // No es propietario por rol
    }

    // Usar el procedimiento almacenado VerificarSiEsPropietario
    const [rows] = await connection.query("CALL VerificarSiEsPropietario(?)", [userId])
    const resultado = rows[0][0].resultado

    if (resultado === "ES_PROPIETARIO") {
      res.sendStatus(200) // ✅ Es propietario
    } else {
      res.sendStatus(403) // ❌ No es propietario
    }
  } catch (err) {
    console.error("Error al verificar propietario:", err)
    return res.status(500).json({ message: "Error del servidor" })
  } finally {
    if (connection) connection.release()
  }
})

/**
 * Endpoint para verificar si un usuario es administrador
 */
router.get("/verificar-administrador", authenticateToken, async (req, res) => {
  let connection
  try {
    const userId = req.user.id_usuario

    connection = await pool.getConnection()

    // Consultar si el usuario es administrador
    const [rows] = await connection.query("SELECT id_rol FROM usuarios WHERE id_usuario = ?", [userId])

    if (rows.length === 0) {
      return res.sendStatus(403) // Usuario no encontrado
    }

    const userRole = rows[0].id_rol

    if (userRole === 1) {
      // 1 es el id_rol para administradores según tu base de datos
      res.sendStatus(200) // ✅ Es administrador
    } else {
      res.sendStatus(403) // ❌ No es administrador
    }
  } catch (err) {
    console.error("Error al verificar administrador:", err)
    return res.status(500).json({ message: "Error del servidor" })
  } finally {
    if (connection) connection.release()
  }
})

module.exports = router
