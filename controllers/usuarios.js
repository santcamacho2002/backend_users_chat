const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario
        .find({ _id: { $ne: req.uid } })
        .sort('-online')
        .skip(desde)
        .limit(20);


    res.json({
        ok: true,
        usuarios,
    });

};

const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { nombre, apellido, semestre, fisicaMecanica, calculoDiferencial, pensamientoAlgoritmico } = req.body;

        const usuarioActualizado = {
            nombre,
            apellido,
            semestre,
            fisicaMecanica,
            calculoDiferencial,
            pensamientoAlgoritmico,
        };

        const usuario = await Usuario.findByIdAndUpdate(
            uid,
            usuarioActualizado,
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserByID = async (req, res) => {
    try {
        const { uid } = req.params;

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        res.json({
            ok: true,
            usuario,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




  

module.exports = {
    getUsuarios,
    updateUser,
    getUserByID
}