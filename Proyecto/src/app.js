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
    password: '12345',
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