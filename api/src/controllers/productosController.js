const {
  getProductosByNegocio,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('../models/productoModel');

// GET /api/productos?idNegocio=1
const getAll = async (req, res, next) => {
  try {
    const idNegocio = +req.query.idNegocio;
    if (!idNegocio) return res.status(400).json({ success: false, message: 'idNegocio es requerido' });
    const data = await getProductosByNegocio(idNegocio);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/productos/:id
const getById = async (req, res, next) => {
  try {
    const data = await getProductoById(+req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// POST /api/productos
const create = async (req, res, next) => {
  try {
    const { IdNegocio, Nombre, PrecioCompra, PrecioVenta } = req.body;
    if (!IdNegocio || !Nombre || PrecioCompra == null || PrecioVenta == null) {
      return res.status(400).json({ success: false, message: 'IdNegocio, Nombre, PrecioCompra y PrecioVenta son requeridos' });
    }
    const data = await createProducto(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

// PUT /api/productos/:id
const update = async (req, res, next) => {
  try {
    const data = await updateProducto(+req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// DELETE /api/productos/:id  (soft delete)
const remove = async (req, res, next) => {
  try {
    const data = await deleteProducto(+req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
