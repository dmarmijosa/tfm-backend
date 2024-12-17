const express = require("express");
const router = express.Router();
const { handleWebhook, getAllWebhooks } = require("../controllers/webhook.controller");
const authMiddleware = require('../middlewares/auth.middleware');
// Ruta protegida por autenticación JWT
router.post("/", handleWebhook);

// Ruta para obtener todos los webhooks (GET)
router.get("/", authMiddleware, getAllWebhooks);

module.exports = router;
