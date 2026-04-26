// Middleware global de manejo de errores
const errorHandler = (err, req, res, next) => {
  // Log detallado en consola del servidor
  console.error('❌ Error:', err.message);
  if (err.originalError) console.error('   SQL Error:', err.originalError.message);
  if (err.stack)         console.error('   Stack:', err.stack.split('\n')[1]?.trim());

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    // detalle extra (solo en development para no exponer datos en producción)
    detail: process.env.NODE_ENV !== 'production'
      ? (err.originalError?.message || err.stack?.split('\n')[0])
      : undefined,
  });
};

module.exports = errorHandler;
