const express = require('express');
const router = express.Router();
const pool = require('../db/conexion'); // conexión a la base de datos
const authenticateToken = require('../middlewares/authenticateToken'); // middleware JWT

/**
 * Endpoint para obtener mascotas del propietario
 */
router.get('/mascotas', authenticateToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Verificar si existe el procedimiento almacenado
    const [checkProc] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.routines 
      WHERE routine_schema = 'mascotas_db' 
      AND routine_name = 'ObtenerMascotasPorPropietario'
    `);

    if (checkProc[0].count === 0) {
      // Si no existe, crear el procedimiento
      await connection.query(`
        CREATE PROCEDURE ObtenerMascotasPorPropietario(
          IN p_id_usuario INT
        )
        BEGIN
          SELECT * FROM mascotas WHERE id_usuario = p_id_usuario;
        END
      `);
      console.log("Procedimiento ObtenerMascotasPorPropietario creado");
    }

    // Usar el procedimiento almacenado
    const [rows] = await connection.query(
      'CALL ObtenerMascotasPorPropietario(?)',
      [req.user.id_usuario]
    );

    res.json(rows[0]); // El resultado está en el primer array
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener las mascotas',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
