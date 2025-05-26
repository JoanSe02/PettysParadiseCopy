const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "mascotas_db",
  port: "3309",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, // Solo si necesitas ejecutar múltiples queries a la vez
});

// Verificar conexión a la base de datos al iniciar
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conectado a MySQL");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err.message);
  });

module.exports = pool;

