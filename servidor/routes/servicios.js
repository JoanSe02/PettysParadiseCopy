const express = require("express");
const router = express.Router();
const pool = require("../db/conexion");

// Servicios
router.get("/servicios", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM servicios");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ success: false, message: "Error al obtener servicios", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Veterinarios
router.get("/veterinarios", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT u.id_usuario, u.nombre, u.apellido, v.especialidad, v.horario
      FROM usuarios u
      JOIN veterinarios v ON u.id_usuario = v.id_vet
      WHERE u.id_rol = 2
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener veterinarios:", error);
    res.status(500).json({ success: false, message: "Error al obtener veterinarios", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
