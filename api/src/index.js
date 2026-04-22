const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const { testConnection } = require('./config/db');

// Importar rutas (agregar más según se necesiten)
// const productosRouter = require('./routes/productos.routes');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Rutas base
app.get('/', (req, res) => res.json({ message: '✅ API funcionando' }));

// app.use('/api/productos', productosRouter);

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();   // ← prueba la BD al arrancar
});

