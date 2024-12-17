const { client } = require("../config/db");

// Controlador para manejar la recepción de webhooks
exports.handleWebhook = async (req, res) => {
  try {
    const { ref, before, after, repository, pusher, commits } = req.body;

    // Validación de campos requeridos
    if (!ref || !before || !after || !repository || !pusher || !commits) {
      return res.status(400).json({ message: "Datos del webhook incompletos" });
    }

    // Estructura del webhook para almacenar
    const webhookData = {
      ref,
      before,
      after,
      repository: {
        name: repository.name,
        full_name: repository.full_name,
      },
      pusher: {
        name: pusher.name,
        email: pusher.email || "N/A",
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
      receivedAt: new Date().toISOString(),
    };

    // Generar una clave única para Redis
    const redisKey = `webhook:${ref}:${Date.now()}`;

    // Guardar en Redis
    await client.set(redisKey, JSON.stringify(webhookData), {
      EX: 60 * 60 * 24, // Expiración opcional: 24 horas
    });

    console.log("✅ Webhook guardado en Redis con clave:", redisKey);

    res.status(200).json({ message: "Webhook guardado correctamente", key: redisKey });
  } catch (error) {
    console.error("❌ Error al guardar en Redis:", error.message);
    res.status(500).json({ message: "Error al procesar el webhook" });
  }
};

exports.getAllWebhooks = async (req, res) => {
    try {
      // Obtener todas las claves que comienzan con "webhook:"
      const keys = await client.keys("webhook:*");
  
      if (keys.length === 0) {
        return res.status(404).json({ message: "No se encontraron registros" });
      }
  
      // Obtener los valores de todas las claves
      const webhooks = await Promise.all(
        keys.map(async (key) => {
          const data = await client.get(key);
          return JSON.parse(data);
        })
      );
  
      res.status(200).json({ message: "Webhooks obtenidos correctamente", webhooks });
    } catch (error) {
      console.error("Error al obtener webhooks:", error.message);
      res.status(500).json({ message: "Error al obtener registros" });
    }
  };