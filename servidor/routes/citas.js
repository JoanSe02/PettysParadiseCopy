const express = require("express");
const router = express.Router();
const pool = require("../db/conexion");
const authenticateToken = require("../middlewares/authenticateToken");

// Obtener citas del propietario (usando procedimiento)
router.get("/", authenticateToken, async (req, res) => {
  let connection;
  try {
    const id_pro = req.user.id_usuario;
    connection = await pool.getConnection();
    const [rows] = await connection.query(`CALL MostrarCitasPorPropietario(?)`, [id_pro]);

    res.json(rows[0]); // El resultado está en rows[0]
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ success: false, message: "Error al obtener citas", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Crear cita (usando procedimiento)
router.post("/", authenticateToken, async (req, res) => {
  let connection;
  try {
    const { cod_mas, cod_ser, id_vet, fech_cit, hora, notas } = req.body;
    const id_pro = req.user.id_usuario;
    connection = await pool.getConnection();

    await connection.query(`CALL InsertarCita(?, ?, ?, ?, ?,?, @new_cita_id)`, [
      fech_cit,
      hora,
      cod_ser,
      id_vet,
      cod_mas,
      id_pro,
      notas
    ]);

    const [[{ new_cita_id }]] = await connection.query(`SELECT @new_cita_id AS new_cita_id`);

    res.status(201).json({ success: true, message: "Cita creada exitosamente", citaId: new_cita_id });
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ success: false, message: "Error al crear la cita", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Actualizar cita (usando procedimiento)
router.put("/:cod_cit", authenticateToken, async (req, res) => {
  let connection;
  try {
    const { cod_cit } = req.params;
    const { cod_mas, cod_ser, id_vet, fech_cit, hora, estado, notas } = req.body;
    const id_pro = req.user.id_usuario;

    connection = await pool.getConnection();

    const [rows] = await connection.query(`SELECT * FROM citas WHERE cod_cit = ? AND id_pro = ?`, [cod_cit, id_pro]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: "No tienes permiso para modificar esta cita" });
    }

    await connection.query(`CALL ActualizarCita(?, ?, ?, ?, ?, ?, ?, ?)`, [
      cod_cit,
      fech_cit,
      hora,
      cod_ser,
      id_vet,
      cod_mas,
      estado,
      notas,
    ]);

    res.json({ success: true, message: "Cita actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ success: false, message: "Error al actualizar la cita", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Cancelar cita (usando procedimiento)
router.put("/:cod_cit/cancelar", authenticateToken, async (req, res) => {
  let connection;
  try {
    const { cod_cit } = req.params;
    const id_pro = req.user.id_usuario;
    connection = await pool.getConnection();

    await connection.query(`CALL CancelarCita(?, ?)`, [cod_cit, id_pro]);

    res.json({ success: true, message: "Cita cancelada exitosamente" });
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    res.status(500).json({ success: false, message: "Error al cancelar la cita", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
