const express = require('express');
const router = express.Router();

const AutomotrizControler = require('../controllers/AutomotrizControler')

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

//RUTA EMPLEADOS
router.get('/empleado', AutomotrizControler.listEmpleado)
router.post('/empleado/add', AutomotrizControler.saveEmpleado)
router.get('/empleado/update/:pk_empleado', AutomotrizControler.editEmpleado)
router.post('/empleado/update/:pk_empleado', AutomotrizControler.updateEmpleado)
router.get('/empleado/delete/:pk_empleado', AutomotrizControler.deleteEmpleado)


module.exports = router;