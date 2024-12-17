const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/webhook.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Ruta protegida por autenticación JWT
router.post("/", authMiddleware, handleWebhook);

module.exports = router;
