const { createClient } = require("redis");

const client = createClient({
  url: process.env.UPSTASH_REDIS_URL, // Almacena tu URL de conexión en variables de entorno
});

client.on("error", (err) => {
  console.error("Error de conexión a Redis:", err);
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Conexión exitosa a Upstash Redis 🚀");
  } catch (error) {
    console.error("❌ Error al conectar a Redis:", error.message);
    process.exit(1);
  }
};

module.exports = { client, connectDB };
