// encriptar.js
const bcrypt = require('bcrypt');
const pool = require('./db/conexion');

function isHashed(password) {
  return /^\$2[aby]?\$[\d]+\$[./A-Za-z0-9]{53}$/.test(password);
}

async function encriptarContrasenas() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [usuarios] = await connection.query("SELECT id_usuario, email, contrasena FROM usuarios");

    let cambios = 0;

    for (const usuario of usuarios) {
      if (!isHashed(usuario.contrasena)) {
        const nuevaHash = await bcrypt.hash(usuario.contrasena, 10);
        await connection.query("UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?", [nuevaHash, usuario.id_usuario]);
        console.log(`🔒 Contraseña encriptada para usuario ${usuario.email}`);
        cambios++;
      }
    }

    if (cambios === 0) {
      console.log("✅ Todas las contraseñas ya estaban encriptadas.");
    } else {
      console.log(`✅ Se encriptaron ${cambios} contraseñas.`);
    }

    return cambios; // Devolvemos el número de cambios realizados
  } catch (err) {
    console.error("❌ Error al encriptar contraseñas:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = encriptarContrasenas;