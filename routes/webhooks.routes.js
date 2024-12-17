const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/webhook.controller");

// Ruta protegida por autenticación JWT
router.post("/", handleWebhook);

module.exports = router;
