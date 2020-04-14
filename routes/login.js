// ====================================================================
// Requires
// ====================================================================
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');

var app = express();

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email' // TODO: quitar - email para producción
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password' // TODO: quitar - password para producción
            });
        }

        // Crear un token
        usuarioDB.password = 'xD';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, {
            expiresIn: 14400
        }); //NOTE: el token dura 4 horas (cambiar el expiresIn)

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});

module.exports = app;