// Requires
var express = require('express');
var mongoose = require('mongoose');

// Constantes
// Servidor rest
const puertoServidor = 8081;
// Base de datos
const host = 'localhost';
const puertoMongoDB = 27017;
const nombreDB = 'hospitalDB';
// Ruta a base de datos mongo
const rutaDB = 'mongodb://'
    .concat(host)
    .concat(':')
    .concat(puertoMongoDB)
    .concat('/')
    .concat(nombreDB);

// Inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri(rutaDB, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos '.concat(': \x1b[32m').concat('online\x1b[0m'));
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
    });
});

// Escuchar peticiones
app.listen(puertoServidor, () => {
    console.log(
        'Express server puerto '
        .concat(puertoServidor)
        .concat(': \x1b[32m')
        .concat('online\x1b[0m')
    );
});