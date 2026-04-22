const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,   // ej: 'localhost' o 'IP'
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,                 // true solo si usas Azure
    trustServerCertificate: true,  // necesario para SQL Server local
  },
};

let pool = null;

const getConnection = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(dbConfig);
      console.log(`✅ Conectado a SQL Server → ${process.env.DB_SERVER}/${process.env.DB_NAME}`);
    } catch (err) {
      console.error('❌ Error al conectar con SQL Server:', err.message);
      throw err;
    }
  }
  return pool;
};

// Prueba de conexión al iniciar el servidor
const testConnection = async () => {
  try {
    const conn = await getConnection();
    const result = await conn.request().query('SELECT GETDATE() AS fecha');
    console.log('🗓️  Fecha SQL Server:', result.recordset[0].fecha);
  } catch (err) {
    console.error('❌ Fallo en la prueba de conexión:', err.message);
  }
};

module.exports = { getConnection, testConnection, sql };

