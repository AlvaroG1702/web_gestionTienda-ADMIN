const { getConnection, sql } = require('../config/db');

// Obtener todos los negocios activos
const getAllNegocios = async () => {
  const pool = await getConnection();
  const result = await pool.request()
    .query(`
      SELECT IdNegocio, Nombre, Slug, Direccion, Tipo, Logo_url, Estado, FechaCreacion
      FROM DIM_NEGOCIO
      WHERE Estado = 1
      ORDER BY Nombre
    `);
  return result.recordset;
};

// Obtener un negocio por ID
const getNegocioById = async (idNegocio) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idNegocio', sql.Int, idNegocio)
    .query(`
      SELECT IdNegocio, Nombre, Slug, Direccion, Tipo, Logo_url, Estado, FechaCreacion
      FROM DIM_NEGOCIO
      WHERE IdNegocio = @idNegocio
    `);
  return result.recordset[0] || null;
};

module.exports = { getAllNegocios, getNegocioById };
