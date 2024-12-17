const express = require('express');
require('dotenv').config();
const mongoose = require('./config/db');

//Rutas
const authRouter = require('./routes/auth.routes');
const webhookRouter =  require('./routes/webhooks.routes');

const app = express();

//middleware
app.use(express.json());

//rutas
app.use('/api/auth', authRouter);
app.use('/api/webhook', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running 🚀 in the port: ${PORT}`);
})