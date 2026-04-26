const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getUserByEmailOrNombre, createSession, deleteSession, updateLastAccess } = require('../models/authModel');

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Usuario/correo y contraseña son requeridos' });
    }

    // 1. Buscar usuario por email o nombre
    const user = await getUserByEmailOrNombre(identifier.trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // 2. Verificar contraseña
    const passwordOk = await bcrypt.compare(password, user.Password_hash);
    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // 3. Generar JWT
    const payload = {
      IdUsuario:   user.IdUsuario,
      Nombre:      user.Nombre,
      Email:       user.Email,
      IdRol:       user.IdRol,
      NombreRol:   user.NombreRol,
      IdNegocio:   user.IdNegocio,
      NombreNegocio: user.NombreNegocio,
    };
    const expiresIn  = process.env.JWT_EXPIRES_IN || '8h';
    const token      = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    const expiraDate = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8h en ms

    // 4. Guardar sesión + actualizar último acceso
    await createSession(user.IdUsuario, token, expiraDate);
    await updateLastAccess(user.IdUsuario);

    res.json({
      success: true,
      token,
      user: payload,
    });
  } catch (err) { next(err); }
};

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) await deleteSession(token);
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (err) { next(err); }
};

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
const me = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, logout, me };
