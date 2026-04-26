const { getConnection, sql } = require('../config/db');

// ─── Helper: obtener o crear entrada en DIM_TIEMPO para hoy ────────────────────
const getOrCreateTiempoHoy = async (pool) => {
  const hoy = new Date();
  const fecha = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const mes = hoy.getMonth() + 1;
  const trimestre = Math.ceil(mes / 3);

  const check = await pool.request()
    .input('Fecha', sql.Date, fecha)
    .query('SELECT IdTiempo FROM DIM_TIEMPO WHERE Fecha = @Fecha');

  if (check.recordset.length > 0) return check.recordset[0].IdTiempo;

  const insert = await pool.request()
    .input('Fecha', sql.Date, fecha)
    .input('Dia', sql.Int, hoy.getDate())
    .input('Mes', sql.Int, mes)
    .input('Trimestre', sql.Int, trimestre)
    .input('Anio', sql.Int, hoy.getFullYear())
    .query(`
      INSERT INTO DIM_TIEMPO (Fecha, Dia, Mes, Trimestre, Anio)
      OUTPUT INSERTED.IdTiempo
      VALUES (@Fecha, @Dia, @Mes, @Trimestre, @Anio)
    `);
  return insert.recordset[0].IdTiempo;
};

// ─── GET: productos de un negocio con precio más reciente ─────────────────────
const getProductosByNegocio = async (idNegocio) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idNegocio', sql.Int, idNegocio)
    .query(`
      SELECT
        np.IdNegocioProducto,
        p.IdProducto,
        p.Nombre,
        p.Descripcion,
        p.Codigo_barras,
        p.Imagen_url,
        c.IdCategoria,
        c.Nombre          AS NombreCategoria,
        pv.IdProveedor,
        pv.Nombre         AS NombreProveedor,
        fp.PrecioCompra,
        fp.PrecioVenta,
        fp.PrecioPaquete,
        fp.CantidadPorPaquete,
        fp.MargenGanancia,
        fp.FechaActualizacion,
        np.Estado
      FROM NEGOCIO_PRODUCTO np
      INNER JOIN DIM_PRODUCTO    p  ON np.IdProducto  = p.IdProducto
      LEFT  JOIN DIM_CATEGORIA   c  ON p.IdCategoria  = c.IdCategoria
      LEFT  JOIN DIM_PROVEEDOR   pv ON np.IdProveedor = pv.IdProveedor
      LEFT  JOIN FACT_PRECIO_PRODUCTO fp
             ON fp.IdNegocioProducto = np.IdNegocioProducto
            AND fp.IdPrecioProducto  = (
                  SELECT MAX(fp2.IdPrecioProducto)
                  FROM   FACT_PRECIO_PRODUCTO fp2
                  WHERE  fp2.IdNegocioProducto = np.IdNegocioProducto
                )
      WHERE np.IdNegocio = @idNegocio
      ORDER BY p.Nombre
    `);
  return result.recordset;
};

// ─── GET: un producto por IdNegocioProducto ────────────────────────────────────
const getProductoById = async (idNegocioProducto) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idNP', sql.Int, idNegocioProducto)
    .query(`
      SELECT
        np.IdNegocioProducto,
        p.IdProducto,
        p.Nombre,
        p.Descripcion,
        p.Codigo_barras,
        p.Imagen_url,
        c.IdCategoria,
        c.Nombre          AS NombreCategoria,
        pv.IdProveedor,
        pv.Nombre         AS NombreProveedor,
        fp.PrecioCompra,
        fp.PrecioVenta,
        fp.PrecioPaquete,
        fp.CantidadPorPaquete,
        fp.MargenGanancia,
        fp.FechaActualizacion,
        np.Estado
      FROM NEGOCIO_PRODUCTO np
      INNER JOIN DIM_PRODUCTO    p  ON np.IdProducto  = p.IdProducto
      LEFT  JOIN DIM_CATEGORIA   c  ON p.IdCategoria  = c.IdCategoria
      LEFT  JOIN DIM_PROVEEDOR   pv ON np.IdProveedor = pv.IdProveedor
      LEFT  JOIN FACT_PRECIO_PRODUCTO fp
             ON fp.IdNegocioProducto = np.IdNegocioProducto
            AND fp.IdPrecioProducto  = (
                  SELECT MAX(fp2.IdPrecioProducto)
                  FROM   FACT_PRECIO_PRODUCTO fp2
                  WHERE  fp2.IdNegocioProducto = np.IdNegocioProducto
                )
      WHERE np.IdNegocioProducto = @idNP
    `);
  return result.recordset[0] || null;
};

// ─── POST: crear producto (3 inserts en transacción) ──────────────────────────
const createProducto = async ({
  IdNegocio, IdProveedor, IdCategoria, IdUsuario,
  Nombre, Descripcion, Codigo_barras, Imagen_url,
  PrecioCompra, PrecioVenta, PrecioPaquete, CantidadPorPaquete,
}) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {
    // 1. DIM_PRODUCTO
    const r1 = await transaction.request()
      .input('Nombre', sql.VarChar(150), Nombre)
      .input('Descripcion', sql.VarChar(200), Descripcion || null)
      .input('Codigo_barras', sql.VarChar(50), Codigo_barras || null)
      .input('Imagen_url', sql.VarChar(500), Imagen_url || null)
      .input('IdCategoria', sql.Int, IdCategoria || null)
      .query(`
        INSERT INTO DIM_PRODUCTO (Nombre, Descripcion, Codigo_barras, Imagen_url, IdCategoria)
        OUTPUT INSERTED.IdProducto
        VALUES (@Nombre, @Descripcion, @Codigo_barras, @Imagen_url, @IdCategoria)
      `);
    const idProducto = r1.recordset[0].IdProducto;

    // 2. NEGOCIO_PRODUCTO
    const r2 = await transaction.request()
      .input('IdNegocio', sql.Int, IdNegocio)
      .input('IdProducto', sql.Int, idProducto)
      .input('IdProveedor', sql.Int, IdProveedor || null)
      .query(`
        INSERT INTO NEGOCIO_PRODUCTO (IdNegocio, IdProducto, IdProveedor, Estado)
        OUTPUT INSERTED.IdNegocioProducto
        VALUES (@IdNegocio, @IdProducto, @IdProveedor, 1)
      `);
    const idNegocioProducto = r2.recordset[0].IdNegocioProducto;

    // 3. DIM_TIEMPO (hoy)
    const idTiempo = await getOrCreateTiempoHoy(pool);

    // 4. FACT_PRECIO_PRODUCTO (incluye campos de paquete opcionales)
    await transaction.request()
      .input('IdNegocioProducto', sql.Int, idNegocioProducto)
      .input('IdTiempo', sql.Int, idTiempo)
      .input('IdUsuario', sql.Int, IdUsuario || 1)
      .input('PrecioCompra', sql.Decimal(10, 2), PrecioCompra)
      .input('PrecioVenta', sql.Decimal(10, 2), PrecioVenta)
      .input('PrecioPaquete', sql.Decimal(10, 2), PrecioPaquete ?? null)
      .input('CantidadPorPaquete', sql.Int, CantidadPorPaquete ?? null)
      .query(`
        INSERT INTO FACT_PRECIO_PRODUCTO
          (IdNegocioProducto, IdTiempo, IdUsuario, PrecioCompra, PrecioVenta, PrecioPaquete, CantidadPorPaquete)
        VALUES
          (@IdNegocioProducto, @IdTiempo, @IdUsuario, @PrecioCompra, @PrecioVenta, @PrecioPaquete, @CantidadPorPaquete)
      `);

    await transaction.commit();
    return getProductoById(idNegocioProducto);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

// ─── PUT: actualizar producto (+ nuevo precio si cambió) ──────────────────────
const updateProducto = async (idNegocioProducto, {
  IdCategoria, IdProveedor, IdUsuario,
  Nombre, Descripcion, Codigo_barras, Imagen_url,
  PrecioCompra, PrecioVenta, PrecioPaquete, CantidadPorPaquete,
  Estado,
}) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {
    // Obtener IdProducto
    const base = await pool.request()
      .input('idNP', sql.Int, idNegocioProducto)
      .query('SELECT IdProducto FROM NEGOCIO_PRODUCTO WHERE IdNegocioProducto = @idNP');
    if (!base.recordset[0]) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
    const idProducto = base.recordset[0].IdProducto;

    // Actualizar DIM_PRODUCTO
    await transaction.request()
      .input('IdProducto', sql.Int, idProducto)
      .input('Nombre', sql.VarChar(150), Nombre)
      .input('Descripcion', sql.VarChar(200), Descripcion || null)
      .input('Codigo_barras', sql.VarChar(50), Codigo_barras || null)
      .input('Imagen_url', sql.VarChar(500), Imagen_url || null)
      .input('IdCategoria', sql.Int, IdCategoria || null)
      .query(`
        UPDATE DIM_PRODUCTO
        SET Nombre = @Nombre, Descripcion = @Descripcion,
            Codigo_barras = @Codigo_barras, Imagen_url = @Imagen_url,
            IdCategoria = @IdCategoria
        WHERE IdProducto = @IdProducto
      `);

    // Actualizar proveedor y estado en NEGOCIO_PRODUCTO
    if (IdProveedor !== undefined || Estado !== undefined) {
      const updateNP = transaction.request().input('idNP', sql.Int, idNegocioProducto);
      let sets = [];
      if (IdProveedor !== undefined) {
        sets.push('IdProveedor = @IdProveedor');
        updateNP.input('IdProveedor', sql.Int, IdProveedor || null);
      }
      if (Estado !== undefined) {
        sets.push('Estado = @Estado');
        updateNP.input('Estado', sql.Bit, Estado ? 1 : 0);
      }
      await updateNP.query(`UPDATE NEGOCIO_PRODUCTO SET ${sets.join(', ')} WHERE IdNegocioProducto = @idNP`);
    }

    // Insertar nuevo registro de precio si se envió algún precio
    if (PrecioCompra !== undefined && PrecioVenta !== undefined) {
      const idTiempo = await getOrCreateTiempoHoy(pool);
      await transaction.request()
        .input('IdNegocioProducto', sql.Int, idNegocioProducto)
        .input('IdTiempo', sql.Int, idTiempo)
        .input('IdUsuario', sql.Int, IdUsuario || 1)
        .input('PrecioCompra', sql.Decimal(10, 2), PrecioCompra)
        .input('PrecioVenta', sql.Decimal(10, 2), PrecioVenta)
        .input('PrecioPaquete', sql.Decimal(10, 2), PrecioPaquete ?? null)
        .input('CantidadPorPaquete', sql.Int, CantidadPorPaquete ?? null)
        .query(`
          INSERT INTO FACT_PRECIO_PRODUCTO
            (IdNegocioProducto, IdTiempo, IdUsuario, PrecioCompra, PrecioVenta, PrecioPaquete, CantidadPorPaquete)
          VALUES
            (@IdNegocioProducto, @IdTiempo, @IdUsuario, @PrecioCompra, @PrecioVenta, @PrecioPaquete, @CantidadPorPaquete)
        `);
    }

    await transaction.commit();
    return getProductoById(idNegocioProducto);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

// ─── DELETE: soft delete (Estado = 0) ─────────────────────────────────────────
const deleteProducto = async (idNegocioProducto) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idNP', sql.Int, idNegocioProducto)
    .query(`
      UPDATE NEGOCIO_PRODUCTO
      SET Estado = 0
      OUTPUT INSERTED.IdNegocioProducto
      WHERE IdNegocioProducto = @idNP
    `);
  if (result.recordset.length === 0)
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
  return { deleted: true, IdNegocioProducto: idNegocioProducto };
};

module.exports = {
  getProductosByNegocio,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
