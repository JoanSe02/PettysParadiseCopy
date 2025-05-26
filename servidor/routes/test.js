// Ruta de test para verificar conectividad
const express = require("express")
const router = express.Router()

router.get("/test", (req, res) => {
  console.log("=== TEST ENDPOINT CALLED ===")
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
