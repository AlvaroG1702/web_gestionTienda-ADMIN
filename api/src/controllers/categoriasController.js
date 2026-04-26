const { getAllCategorias, createCategoria } = require('../models/categoriaModel');

const getAll = async (req, res, next) => {
  try {
    const data = await getAllCategorias();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { Nombre, Descripcion } = req.body;
    if (!Nombre) return res.status(400).json({ success: false, message: 'El campo Nombre es requerido' });
    const data = await createCategoria({ Nombre, Descripcion });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, create };
