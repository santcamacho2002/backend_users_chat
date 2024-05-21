const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  semestre: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  fisicaMecanica: {
    type: Boolean,
    default: false
  },
  calculoDiferencial: {
    type: Boolean,
    default: false
  },
  pensamientoAlgoritmico: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default: false
  }

});

UsuarioSchema.method('toJSON', function(){
  const { __v, _id, contrasena, ...object} = this.toObject();
  object.uid = _id;
  return object;
})

module.exports = model('Usuario', UsuarioSchema);
