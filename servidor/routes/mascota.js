const express = require("express")
const router = express.Router()
const pool = require("../db/conexion")

// Endpoint para crear mascota (sin procedimiento almacenado)
router.post("/create", async (req, res) => {
  let connection
  try {
    console.log("📦 Datos recibidos:", req.body)

    const {
      nom_mas,
      especie,
      raza,
      edad,
      genero,
      peso,
      id_pro,
      foto = "",
    } = req.body

    // Validación de campos obligatorios
    if (!nom_mas || !especie || !raza || !edad || !genero || !peso || !id_pro) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios",
        requiredFields: ["nom_mas", "especie", "raza", "edad", "genero", "peso", "id_pro"],
      })
    }

    connection = await pool.getConnection()

    // Llamada al procedimiento almacenado CORREGIDO
    const [rows] = await connection.query(
      `CALL CrearMascota(?, ?, ?, ?, ?, ?, ?, ?, @cod_mas)`,
      [
        nom_mas,
        especie,
        raza,
        Number.parseFloat(edad),
        genero,
        Number.parseFloat(peso),
        Number.parseInt(id_pro),
        foto
      ]
    )

    // Obtener el valor de salida
    const [result] = await connection.query("SELECT @cod_mas as cod_mas")
    const cod_mas = result[0].cod_mas

    console.log("✅ Mascota creada con ID:", cod_mas)

    res.status(201).json({
      success: true,
      message: "Mascota creada correctamente",
      cod_mas: cod_mas,
      data: {
        cod_mas,
        nom_mas,
        especie,
        raza,
        edad: Number.parseFloat(edad),
        genero,
        peso: Number.parseFloat(peso),
        id_pro: Number.parseInt(id_pro),
        foto,
      },
    })
  } catch (err) {
    console.error("❌ Error al crear mascota:", err)

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "El propietario con el ID proporcionado no existe",
      })
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : "Error interno",
    })
  } finally {
    if (connection) connection.release()
  }
})

module.exports = router