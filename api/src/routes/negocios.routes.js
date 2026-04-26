const router = require('express').Router();
const ctrl = require('../controllers/negociosController');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

module.exports = router;
