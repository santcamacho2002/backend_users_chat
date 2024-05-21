/*
    path: api/usuarios

*/

const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsuarios, updateUser, getUserByID } = require('../controllers/usuarios');
const { updatePassword } = require('../controllers/usuarios');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.put('/editar/:uid', updateUser);
router.get('/getUsuario/:uid', getUserByID);

module.exports = router;