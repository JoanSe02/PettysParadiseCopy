const express = require("express");
const cors = require("cors");
const app = express();
const encriptarContrasenas = require('./encrypt'); // Importamos el script

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Middleware para log de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Importar rutas
const authRoutes = require("./routes/auth");
const mascotasRoutes = require("./routes/mascota");
const citasRoutes = require("./routes/citas");
const passwordRoutes = require("./routes/password");
const rolesRoutes = require("./routes/roles");
const serviciosRoutes = require("./routes/servicios");
const verMasRoutes = require("./routes/vermas");

// Usar rutas con prefijos
app.use("/api/auth", authRoutes);
app.use("/api/mascota", mascotasRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/vermas", verMasRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Ejecutar encriptación solo si se especifica el flag --encrypt
    if (process.argv.includes('--encrypt')) {
      console.log("Iniciando proceso de encriptación de contraseñas...");
      await encriptarContrasenas();
      console.log("Proceso de encriptación completado.");
      
      // Si solo queremos encriptar y salir, descomenta la siguiente línea:
      // process.exit(0);
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();