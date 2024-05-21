const Usuario = require('../models/usuario'); 
const Mensaje = require('../models/mensaje');

const usuarioConectado = async (uid = '') => {
    try {
        const usuario = await Usuario.findById(uid);
        if (!usuario) throw new Error('Usuario no encontrado');
        
        usuario.online = true;
        await usuario.save();
        return usuario;
    } catch (error) {
        console.error('Error al conectar usuario:', error);
        throw error; 
    }
}

const usuarioDesconectado = async (uid = '') => {
    try {
        const usuario = await Usuario.findById(uid);
        if (!usuario) throw new Error('Usuario no encontrado');
        
        usuario.online = false;
        await usuario.save();
        return usuario;
    } catch (error) {
        console.error('Error al desconectar usuario:', error);
        throw error;
    }
}

const grabarMensaje = async (payload) => {

    try {
        const mensaje = new Mensaje(payload);
        await mensaje.save();

        return true;
        
    } catch (error) {
        return false;
        
    }

}

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje
}
