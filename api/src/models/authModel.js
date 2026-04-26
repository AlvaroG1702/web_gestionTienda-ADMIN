const { getConnection, sql } = require('../config/db');

// Obtener usuario por email O por nombre (login flexible)
const getUserByEmailOrNombre = async (identifier) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('Identifier', sql.VarChar(150), identifier)
    .query(`
      SELECT
        u.IdUsuario,
        u.Nombre,
        u.Email,
        u.Password_hash,
        u.IdRol,
        r.Nombre        AS NombreRol,
        u.IdNegocio,
        n.Nombre        AS NombreNegocio,
        u.Estado,
        u.UltimoAcceso
      FROM USUARIO u
      INNER JOIN ROL          r ON u.IdRol     = r.IdRol
      LEFT  JOIN DIM_NEGOCIO  n ON u.IdNegocio = n.IdNegocio
      WHERE (u.Email  = @Identifier OR u.Nombre = @Identifier)
        AND u.Estado  = 1
    `);
  return result.recordset[0] || null;
};

// Guardar sesión JWT en la tabla SESION
const createSession = async (idUsuario, token, expira) => {
  const pool = await getConnection();
  await pool.request()
    .input('IdUsuario', sql.Int,          idUsuario)
    .input('Token',     sql.VarChar(500), token)
    .input('Expira',    sql.DateTime,     expira)
    .query(`
      INSERT INTO SESION (IdUsuario, Token, Expira)
      VALUES (@IdUsuario, @Token, @Expira)
    `);
};

// Eliminar sesión al cerrar sesión
const deleteSession = async (token) => {
  const pool = await getConnection();
  await pool.request()
    .input('Token', sql.VarChar(500), token)
    .query('DELETE FROM SESION WHERE Token = @Token');
};

// Actualizar último acceso
const updateLastAccess = async (idUsuario) => {
  const pool = await getConnection();
  await pool.request()
    .input('IdUsuario', sql.Int, idUsuario)
    .query('UPDATE USUARIO SET UltimoAcceso = GETDATE() WHERE IdUsuario = @IdUsuario');
};

module.exports = { getUserByEmailOrNombre, createSession, deleteSession, updateLastAccess };
