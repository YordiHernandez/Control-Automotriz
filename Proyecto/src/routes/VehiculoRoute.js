const express = require('express');
const router = express.Router();

const vehiculoControler = require('../controllers/VehiculoControler')

router.get('/', vehiculoControler.list) //Ruta del API 
router.post('/add', vehiculoControler.save)

module.exports = router;