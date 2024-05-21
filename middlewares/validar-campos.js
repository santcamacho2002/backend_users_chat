const { validationResult } = require("express-validator");



const validarCampos = (req, res, next) =>{

    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({//Bad request
            ok: false,
            errores: errores.mapped() //Mapea los errores
        });
    }

    next();

}

module.exports = {
    validarCampos
}