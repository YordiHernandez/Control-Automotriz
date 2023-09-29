const express = require('express');
const router = express.Router();


const AutomotrizControler = require('../controllers/AutomotrizControler');
const { randomBytes } = require('crypto');
const { resourceLimits } = require('worker_threads');

router.get('/',AutomotrizControler.index)

//RUTAS DE VEHICULOS
router.get('/vehiculo', AutomotrizControler.listVehicule) //Ruta del API 
router.post('/vehiculo/add', AutomotrizControler.saveVehicule)
router.get('/vehiculo/delete/:pk_vehiculo', AutomotrizControler.deleteVehiculo)
router.get('/vehiculo/update/:pk_vehiculo', AutomotrizControler.editVehicule)
router.post('/vehiculo/update/:pk_vehiculo', AutomotrizControler.updateVehiculo)

//RUTA DE MARCA
router.get('/marca', AutomotrizControler.listMarca)
router.post('/marca/add', AutomotrizControler.saveMarca)
router.get('/marca/update/:pk_marca', AutomotrizControler.editMarca)
router.post('/marca/update/:pk_marca', AutomotrizControler.updateMarca)
router.get('/marca/delete/:pk_marca', AutomotrizControler.deleteMarca)

//RUTA DE TIPO VEHICULO
router.get('/tipoV', AutomotrizControler.listTipoV)
router.post('/tipoV/add', AutomotrizControler.saveTipoV)
router.get('/tipoV/update/:pk_tipo', AutomotrizControler.editTipoV)
router.post('/tipoV/update/:pk_tipo', AutomotrizControler.updateTipoV)
router.get('/tipoV/delete/:pk_tipo', AutomotrizControler.deleteTipoV)

//RUTA DE CLIENTES
router.get('/cliente', AutomotrizControler.listCliente)
router.post('/cliente/add', AutomotrizControler.saveCliente)
router.get('/cliente/update/:pk_cliente', AutomotrizControler.editCliente)
router.post('/cliente/update/:pk_cliente', AutomotrizControler.updateCliente)
router.get('/cliente/delete/:pk_cliente', AutomotrizControler.deleteCliente)

//RUTA EMPLEADOS
router.get('/empleado', AutomotrizControler.listEmpleado)
router.post('/empleado/add', AutomotrizControler.saveEmpleado)
router.get('/empleado/update/:pk_empleado', AutomotrizControler.editEmpleado)
router.post('/empleado/update/:pk_empleado', AutomotrizControler.updateEmpleado)
router.get('/empleado/delete/:pk_empleado', AutomotrizControler.deleteEmpleado)

//RUTA SERVICIOS
router.get('/servicio', AutomotrizControler.listServicio)
router.post('/servicio/add', AutomotrizControler.saveServicio)
router.get('/servicio/update/:pk_servicio', AutomotrizControler.editServicio)
router.post('/servicio/update/:pk_servicio', AutomotrizControler.updateServicio)
router.get('/servicio/delete/:pk_servicio', AutomotrizControler.deleteServicio)

//RUTA DE LOGIN
router.post('/login/validar', AutomotrizControler.login)

//RUTA DE LOGIN ADMIN  
router.post('/login_admin/validar', AutomotrizControler.loginAdmin)

//RUTA MENU USUARIO
router.get('/menu_user', AutomotrizControler.menuUser)

//RUTA MENU ADMINISTRADOR
router.get('/menu_admin', AutomotrizControler.menuAdmin)

module.exports = router;