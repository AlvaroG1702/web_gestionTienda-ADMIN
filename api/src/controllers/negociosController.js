const { getAllNegocios, getNegocioById } = require('../models/negocioModel');

const getAll = async (req, res, next) => {
  try {
    const data = await getAllNegocios();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await getNegocioById(+req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Negocio no encontrado' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById };
