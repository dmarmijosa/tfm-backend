const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Base de datos conectada');
  } catch (err) {
    console.error('Error en la conexión a la base de datos:', err.message);
    process.exit(1);
  }
};

connectDB();
module.exports = mongoose;
