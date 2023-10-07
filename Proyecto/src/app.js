const express = require ('express');
const path = require('path')
const morgan = require('morgan')
const mysql = require('mysql')
const mysql2 = require('mysql2')
const myConnection = require('express-myconnection')
const session = require('express-session')

//exportando rutas
const automotrizRutas = require('./routes/AutomotrizRutas')


const app = express();

// settings
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
const configdb = {
    host: 'localhost',
    user: 'root',
    password: 'Jm59460816',
    port: 3306,
    database: 'automotriz',
};

app.use(session({
    secret: 'un_secreto',
    resave: false,
    saveUninitialized: true
}))

app.use(morgan('dev'));
app.use(myConnection(mysql2, configdb, 'single'));
app.use(express.urlencoded({extended: false}))


//routes
app.use('/', automotrizRutas)
//ROUTES LOGIN

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/login_admin', (req, res) => {
    res.render('login_admin')
})

/////

app.get('/crear_cliente', (req, res) => { //ruta para renderizar crear cliente
    res.render('./crear/crear_cliente')
})

app.get('/crear_vehiculo' , async (req, res)=>{

    const qmarca = await consultarMarca(req) 

    const qtipo = await consultarTipo (req)

    const qcliente = await consultarCliente (req)

    res.render('./crear/crear_vehiculo', { qmarca, qtipo, qcliente });



// Función para consultar las marcas
async function consultarMarca(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM marca', (err, marcas) => {
                        resolve(marcas);
                });    
        });
    });
}

// Función para consultar los tipos de vehículo
async function consultarTipo(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM tipo_vehiculo', (err, tipoV) => {       
                        resolve(tipoV);
                });
        });
    })
}

async function consultarCliente(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT pk_cliente, nombre FROM cliente', (err, cliente) => {       
                        resolve(cliente);
                });
        });
    })
}
})
//COTIZACION
app.get('/crear_cotizacion' , async (req, res)=>{
    
    const userId = req.session.userId;

    const qservicio = await consultarServicio(req) 

    const qvehiculo = await consultarVehiculo(req)

    res.render('./crear/crear_cotizacion', { qservicio, qvehiculo });

// Función para consultar las marcas
async function consultarServicio(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM servicio', (err, servicio) => {
                        resolve(servicio);
                });    
        });
    });
}

// Función para consultar los tipos de vehículo
async function consultarVehiculo(req) {

    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query(`SELECT * FROM vehiculo where fk_cliente = ${userId}`, (err, vehiculo) => {       
                        resolve(vehiculo);
                });
        });
    })
}

})

//CITAS
app.get('/crear_cita' , async (req, res)=>{
    
    const userId = req.session.userId;

    const qcotizacion = await consultarCotizacion(req) 

    const qempleado = await consultarEmpleado(req)

    res.render('./crear/crear_cita', { qcotizacion, qempleado });

// Función para consultar las marcas
async function consultarCotizacion(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM cotizacion cz inner join vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo WHERE Est_Cotizacion = "En Espera"', 
                (err, cotizacion) => {
                        resolve(cotizacion);
                });    
        });
    });
}

// Función para consultar los tipos de vehículo
async function consultarEmpleado(req) {

    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query(`SELECT * FROM empleado`, (err, empleado) => {       
                        resolve(empleado);
                });
        });
    })
}
})

app.get('/crear_vehiculo_admin' , async (req, res)=>{

    const qmarca = await consultarMarca(req) 

    const qtipo = await consultarTipo (req)

    const qcliente = await consultarCliente (req)

    res.render('./crear/crear_vehiculo_admin', { qmarca, qtipo, qcliente });

// Función para consultar las marcas
async function consultarMarca(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM marca', (err, marcas) => {
                        resolve(marcas);
                });    
        });
    });
}

// Función para consultar los tipos de vehículo
async function consultarTipo(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM tipo_vehiculo', (err, tipoV) => {       
                        resolve(tipoV);
                });
        });
    })
}

async function consultarCliente(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT pk_cliente, nombre FROM cliente', (err, cliente) => {       
                        resolve(cliente);
                });
        });
    })
}


})


//static files
app.use(express.static(path.join(__dirname, '../public')))

//starting server
app.listen(app.get('port'), ()=> {
    console.log('server on port 3000');
})

module.exports = app