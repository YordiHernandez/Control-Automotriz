const express = require('express');
const router = express.Router();

const AutomotrizControler = require('../controllers/AutomotrizControler')
//RUTAS DE VEHICULOS
router.get('/vehiculos', AutomotrizControler.listVehicule) //Ruta del API 
router.post('/vehiculos/add', AutomotrizControler.saveVehicule)
router.get('/vehiculos/delete/:pk_Id_Vehiculo', AutomotrizControler.deleteVehiculo)
router.get('/vehiculos/update/:pk_Id_Vehiculo', AutomotrizControler.editVehicule)
router.post('/vehiculos/update/:pk_Id_Vehiculo', AutomotrizControler.updateVehiculo)

//RUTA DE MARCA
router.get('/marca', AutomotrizControler.listMarca)
router.post('/marca/add', AutomotrizControler.saveMarca)
router.get('/marca/update/:pk_marca', AutomotrizControler.editMarca)
router.post('/marca/update/:pk_marca', AutomotrizControler.updateMarca)
router.get('/marca/delete/:pk_marca', AutomotrizControler.deleteMarca)

//RUTA DE TIPO VEHICULO
router.get('/tipoV', AutomotrizControler.listTipoV)



module.exports = router;