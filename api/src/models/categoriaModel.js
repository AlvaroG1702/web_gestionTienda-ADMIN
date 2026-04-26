const { getConnection, sql } = require('../config/db');

// Obtener todas las categorías (catálogo global)
const getAllCategorias = async () => {
  const pool = await getConnection();
  const result = await pool.request()
    .query(`
      SELECT IdCategoria, Nombre, Descripcion
      FROM DIM_CATEGORIA
      ORDER BY Nombre
    `);
  return result.recordset;
};

// Crear una categoría nueva
const createCategoria = async ({ Nombre, Descripcion }) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('Nombre',      sql.VarChar(50),  Nombre)
    .input('Descripcion', sql.VarChar(100), Descripcion || null)
    .query(`
      INSERT INTO DIM_CATEGORIA (Nombre, Descripcion)
      OUTPUT INSERTED.*
      VALUES (@Nombre, @Descripcion)
    `);
  return result.recordset[0];
};

module.exports = { getAllCategorias, createCategoria };
