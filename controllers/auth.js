const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const {correo, contrasena} = req.body;

    try {

        const existeCorreo = await Usuario.findOne({correo});

        if(existeCorreo){
            return res.status(400).json({
                ok:false,
                msg: 'Credenciales no validas'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.contrasena = bcrypt.hashSync(contrasena, salt);

        //Se guarda en la base de datos
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }


}

const login = async (req, res = response) => {

    const{correo, contrasena} = req.body;

    try {

        //Validar mail
        const usuarioDB = await Usuario.findOne({correo});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales invalidas'
            });
        }

        //Validar pwsd
        const validarPassword = bcrypt.compareSync(contrasena, usuarioDB.contrasena);
        if(!validarPassword){
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales invalidas'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);

        //Respuesta Login existoso
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}


const renewToken = async (req, res = response) => {
    // Se recupera el uid del usuario
    const uid = req.uid;

    try {
        // Se obtiene el usuario por el uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Se genera un nuevo JWT con el uid
        const token = await generarJWT(uid);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}