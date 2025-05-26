const express = require('express');
const bcrypt = require('bcrypt');
const pool = require("../db/conexion");
const router = express.Router();

// Declare the pool variable


router.post('/reset-password', async (req, res) => {
  let connection;
  try {
    // Log para debugging
    console.log('Datos recibidos:', req.body);
    
    const { email, nuevaContrasena } = req.body;

    // Validaciones básicas
    if (!email || !nuevaContrasena) {
      console.log('Error: Faltan datos requeridos');
      return res.status(400).json({
        success: false,
        message: "Email y nueva contraseña son requeridos",
        received: { email: !!email, nuevaContrasena: !!nuevaContrasena }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Formato de email inválido"
      });
    }

    // Validar longitud de contraseña
    if (nuevaContrasena.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    connection = await pool.getConnection();

    // Obtener usuario con contraseña actual
    const [rows] = await connection.query(
      "SELECT id_usuario, contrasena FROM usuarios WHERE email = ?", 
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const usuario = rows[0];

    // Verificar que la nueva contraseña no sea igual a la actual
    const isSamePassword = await bcrypt.compare(nuevaContrasena, usuario.contrasena);
    
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la contraseña actual"
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar contraseña
    const [updateResult] = await connection.query(
      "UPDATE usuarios SET contrasena = ? WHERE email = ?", 
      [hashedPassword, email]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "No se pudo actualizar la contraseña"
      });
    }

    console.log(`Contraseña actualizada para usuario: ${email}`);

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (err) {
    console.error("Error al restablecer contraseña:", err);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  } finally {
    if (connection) connection.release();
  }
});

// Endpoint mejorado para verificar si un correo electrónico existe
router.post('/check-email', async (req, res) => {
  let connection;
  try {
    console.log('Verificando email:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        exists: false, 
        message: 'El email es requerido' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        exists: false, 
        message: 'Formato de email inválido' 
      });
    }

    connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      'SELECT email FROM usuarios WHERE email = ?', 
      [email]
    );
    
    res.json({ 
      exists: rows.length > 0,
      message: rows.length > 0 ? 'Email encontrado' : 'Email no encontrado'
    });
    
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    res.status(500).json({ 
      exists: false, 
      message: 'Error al verificar el correo en la base de datos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

