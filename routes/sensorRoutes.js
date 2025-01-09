const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor');

router.get('/', sensorController.getSensorData);

router.post('/', sensorController.addSensorData);

module.exports = router;
