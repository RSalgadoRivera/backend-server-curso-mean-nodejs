// ====================================================================
// Requires
// ====================================================================
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// ====================================================================
// Listado de roles válidos
// ====================================================================
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{PATH} no es un rol válido'
};

// ====================================================================
// Crear usuario
// ====================================================================
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    }
});

// ====================================================================
// Mensaje de validación
// ====================================================================
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);