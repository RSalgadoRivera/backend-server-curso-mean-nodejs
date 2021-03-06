// ====================================================================
// Requires
// ====================================================================
var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ====================================================================
// Obtener todos los usuarios
// ====================================================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });
        });
});

// ====================================================================
// Crear un nuevo usuario
// ====================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: String(body.role).toUpperCase()
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});

// ====================================================================
// Actualizar usuario
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario con el ID '.concat(id).concat(' no existe!'),
                errors: { message: 'No existe un usuario con ése ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = String(body.role).toUpperCase();

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioActualizado.password = 'xD';

            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            });
        });
    });
});

// ====================================================================
// Borrar un usuario por ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con el ID '.concat(id),
                errors: { message: 'No existe usuario con ese ID' }
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

// ====================================================================
// Exportar módulo
// ====================================================================
module.exports = app;