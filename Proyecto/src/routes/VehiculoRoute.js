const express = require('express');
const router = express.Router();

const vehiculoControler = require('../controllers/VehiculoControler')

router.get('/', vehiculoControler.list) //Ruta del API 
router.post('/add', vehiculoControler.save)
router.get('/delete/:pk_Id_Vehiculo', vehiculoControler.delete)
router.get('/update/:pk_Id_Vehiculo', vehiculoControler.edit)
router.post('/update/:pk_Id_Vehiculo', vehiculoControler.update)


module.exports = router;