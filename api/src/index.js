const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const errorHandler      = require('./middlewares/errorHandler');
const { testConnection } = require('./config/db');

// ── Rutas ──────────────────────────────────────────────────────────────────────
const authRouter       = require('./routes/auth.routes');
const negociosRouter    = require('./routes/negocios.routes');
const categoriasRouter  = require('./routes/categorias.routes');
const proveedoresRouter = require('./routes/proveedores.routes');
const productosRouter   = require('./routes/productos.routes');

const app = express();

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ API ORUEL_DEV funcionando' }));

// ── API routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRouter);
app.use('/api/negocios',    negociosRouter);
app.use('/api/categorias',  categoriasRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/productos',   productosRouter);

// ── Error handler (siempre al final) ──────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});

