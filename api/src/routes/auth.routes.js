const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login',  ctrl.login);
router.post('/logout', ctrl.logout);           // no requiere auth para poder llamarlo con token expirado
router.get('/me',      authMiddleware, ctrl.me);

module.exports = router;
