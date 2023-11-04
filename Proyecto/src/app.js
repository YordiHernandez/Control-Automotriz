const express = require ('express');
const path = require('path')
const morgan = require('morgan')
const mysql = require('mysql')
const mysql2 = require('mysql2')
const myConnection = require('express-myconnection')
const session = require('express-session')
const nodemailer = require('nodemailer')
const multer = require('multer');
const expressBusboy = require('express-busboy')

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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: 'tallereltridente@gmail.com',
        pass: 'bilt qogr dqdw kzoz'
    }
})
transporter.verify().then(()=>{
    console.log('Email conectado')
})

app.use(morgan('dev'));
app.use(session({
    secret: 'un_secreto',
    resave: false,
    saveUninitialized: true
}))

app.use(myConnection(mysql2, configdb, 'single'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const storage = multer.memoryStorage(/*{filename: (req, file, cb) =>{
    cb(null, file.originalname);
}}*/); // O usa el almacenamiento adecuado para tu caso
const upload = multer({ storage: storage });

//app.use(upload.single('archivo')); 

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
    
    const fechaActual = new Date();
    const fechaminima = new Date(fechaActual);

    // Calcular la fecha mínima (7 días antes de la fecha actual)
    fechaminima.setHours(7,0,0);
    const fechamaxima = new Date(fechaActual);
    fechamaxima.setHours(20,0,0);
    fechamaxima.setDate(fechaActual.getDate() + 7);

    const userId = req.session.userId;

    const qservicio = await consultarServicio(req) 

    const qvehiculo = await consultarVehiculo(req)

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

// Formatear las fechas en el formato requerido (YYYY-MM-DDThh:mm)
const formatoFecha = (fecha) => {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  const hh = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// Variables para incrustar en el HTML
const fechaMinimaFormateada = formatoFecha(fechaActual);
const fechaMaximaFormateada = formatoFecha(fechamaxima);

res.render('./crear/crear_cotizacion', { qservicio, qvehiculo, fechaMaximaFormateada, fechaMinimaFormateada});
})

//CITAS
app.get('/crear_cita' , async (req, res)=>{
    
    const userId = req.session.userId;

    const qcotizacion = await consultarCotizacion(req) 

    const qempleado = await consultarEmpleado(req)

    res.render('./crear/crear_cita', { qcotizacion, qempleado });

// Función para consultar 
async function consultarCotizacion(req) {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
                conn.query('SELECT * FROM cotizacion cz inner join vehiculo vh on vh.pk_vehiculo = cz.fk_vehiculo WHERE Est_Cotizacion = "Aceptada"', 
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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//starting server
app.listen(app.get('port'), ()=> {
    console.log('server on port 3000');
})

module.exports = {app , transporter}

