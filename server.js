const express = require('express');
require('dotenv').config();
const { connectDB } = require('./config/db'); // Importamos la conexión a Redis


//Rutas
const authRouter = require('./routes/auth.routes');
const webhookRouter =  require('./routes/webhooks.routes');

const app = express();

// Conexión a la base de datos
connectDB(); // Inicia la conexión a Redis

//middleware
app.use(express.json());

//rutas
app.use('/api/auth', authRouter);
app.use('/api/webhook', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running 🚀 in the port: ${PORT}`);
})