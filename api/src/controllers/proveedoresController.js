const { getProveedoresByNegocio, createProveedor, updateProveedor, deleteProveedor } = require('../models/proveedorModel');

const getByNegocio = async (req, res, next) => {
  try {
    const idNegocio = +req.query.idNegocio;
    if (!idNegocio) return res.status(400).json({ success: false, message: 'idNegocio es requerido' });
    const data = await getProveedoresByNegocio(idNegocio);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { IdNegocio, Nombre, Telefono, Correo } = req.body;
    if (!IdNegocio || !Nombre) return res.status(400).json({ success: false, message: 'IdNegocio y Nombre son requeridos' });
    const data = await createProveedor({ IdNegocio, Nombre, Telefono, Correo });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const { Nombre, Telefono, Correo } = req.body;
    if (!Nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
    const data = await updateProveedor(id, { Nombre, Telefono, Correo });
    if (!data) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const id = +req.params.id;
    await deleteProveedor(id);
    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (err) { next(err); }
};

module.exports = { getByNegocio, create, update, remove };
