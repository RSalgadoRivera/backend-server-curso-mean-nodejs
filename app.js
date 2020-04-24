// ====================================================================
// Requires
// ====================================================================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// ====================================================================
// Constantes y servidor mongo
// ====================================================================
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

// ====================================================================
// Body Parser
// ====================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ====================================================================
// Importar las rutas
// ====================================================================
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var busquedaRoutes = require('./routes/busqueda');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var uploadRoutes = require('./routes/upload');
var logingRoutes = require('./routes/login');
var imagenesRoutes = require('./routes/imagenes');

// ====================================================================
// Conexión a la base de datos
// ====================================================================
mongoose.connection.openUri(rutaDB, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos '.concat(': \x1b[32m').concat('online\x1b[0m'));
});

// ====================================================================
// Rutas
// ====================================================================
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', logingRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

// ====================================================================
// Escuchar peticiones
// ====================================================================
app.listen(puertoServidor, () => {
    console.log(
        'Express server puerto '
        .concat(puertoServidor)
        .concat(': \x1b[32m')
        .concat('online\x1b[0m')
    );
});