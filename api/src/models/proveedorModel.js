const { getConnection, sql } = require('../config/db');

const getProveedoresByNegocio = async (idNegocio) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idNegocio', sql.Int, idNegocio)
    .query(`
      SELECT IdProveedor, IdNegocio, Nombre, Telefono, Correo
      FROM DIM_PROVEEDOR
      WHERE IdNegocio = @idNegocio
      ORDER BY Nombre
    `);
  return result.recordset;
};

const createProveedor = async ({ IdNegocio, Nombre, Telefono, Correo }) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('IdNegocio', sql.Int,        IdNegocio)
    .input('Nombre',    sql.VarChar(50), Nombre)
    .input('Telefono',  sql.VarChar(15), Telefono || null)
    .input('Correo',    sql.VarChar(50), Correo   || null)
    .query(`
      INSERT INTO DIM_PROVEEDOR (IdNegocio, Nombre, Telefono, Correo)
      OUTPUT INSERTED.*
      VALUES (@IdNegocio, @Nombre, @Telefono, @Correo)
    `);
  return result.recordset[0];
};

const updateProveedor = async (id, { Nombre, Telefono, Correo }) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('IdProveedor', sql.Int,        id)
    .input('Nombre',      sql.VarChar(50), Nombre)
    .input('Telefono',    sql.VarChar(15), Telefono || null)
    .input('Correo',      sql.VarChar(50), Correo   || null)
    .query(`
      UPDATE DIM_PROVEEDOR
      SET Nombre = @Nombre, Telefono = @Telefono, Correo = @Correo
      OUTPUT INSERTED.*
      WHERE IdProveedor = @IdProveedor
    `);
  return result.recordset[0];
};

const deleteProveedor = async (id) => {
  const pool = await getConnection();
  await pool.request()
    .input('IdProveedor', sql.Int, id)
    .query('DELETE FROM DIM_PROVEEDOR WHERE IdProveedor = @IdProveedor');
};

module.exports = { getProveedoresByNegocio, createProveedor, updateProveedor, deleteProveedor };
