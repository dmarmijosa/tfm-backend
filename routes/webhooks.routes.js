const express = require('express');
const router = express.Router();
const Webhook = require('../models/webhook.model'); // Importa el modelo
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware ,async (req, res) => {
  try {
    const { ref, before, after, repository, pusher, commits } = req.body;

    // Validación de datos críticos
    if (!ref || !before || !after || !repository || !pusher || !commits) {
      return res.status(400).json({ message: "Datos del webhook incompletos" });
    }

    // Crear un nuevo registro en la base de datos
    const newWebhook = new Webhook({
      ref,
      before,
      after,
      repository: {
        name: repository.name,
        full_name: repository.full_name,
      },
      pusher: {
        name: pusher.name,
        email: pusher.email || "N/A", // Default si falta email
      },
      commits: commits.map(commit => ({
        message: commit.message,
        timestamp: commit.timestamp,
        url: commit.url,
        author: {
          name: commit.author.name,
          email: commit.author.email || "N/A",
        },
      })),
    });

    // Guardar en la base de datos
    await newWebhook.save();

    console.log("Webhook almacenado correctamente.");
    res.status(200).json({ message: "Webhook procesado y guardado" });
  } catch (error) {
    console.error('Error al guardar el webhook:', error.message);
    res.status(500).json({ message: 'Error al procesar el webhook' });
  }
});

module.exports = router;
