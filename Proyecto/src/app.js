const express = require ('express');
const path = require('path')
const morgan = require('morgan')
const mysql = require('mysql')
const mysql2 = require('mysql2')
const myConnection = require('express-myconnection')

//exportando rutas
const vehiculoRoute = require('./routes/VehiculoRoute')


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

app.use(morgan('dev'));
app.use(myConnection(mysql2, configdb, 'single'));
app.use(express.urlencoded({extended: false}))


//routes
app.use('/', vehiculoRoute)


//static files
app.use(express.static(path.join(__dirname, 'public')))

//starting server
app.listen(app.get('port'), ()=> {
    console.log('server on port 3000');
})