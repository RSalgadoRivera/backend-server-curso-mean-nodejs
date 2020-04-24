// ====================================================================
// Requires
// ====================================================================
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

var app = express();

// default options
app.use(fileUpload());

// ====================================================================
// Rutas
// ====================================================================
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    // tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: {
                message: 'Las extensiones válidas son: '.concat(
                    tiposValidos.join(', ')
                )
            }
        });
    }

    // tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: {
                message: 'Las extensiones válidas son: '.concat(
                    tiposValidos.join(', ')
                )
            }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó archivo',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }
    // obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // Sólo estas extensiones se aceptan
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {
                message: 'Las extensiones válidas son: '.concat(
                    extensionesValidas.join(', ')
                )
            }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    error: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El usuario no existe',
                    errors: { error: 'El usuario no existe' }
                });
            }
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }
                usuarioActualizado.password = 'xD';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var pathViejo = './uploads/medicos/' + medico.img;
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    error: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El mèdico no existe',
                    errors: { error: 'El mèdico no existe' }
                });
            }
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de mèdico actualizada',
                    usuarioActualizado: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    error: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El hospital no existe',
                    errors: { error: 'El hospital no existe' }
                });
            }
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;