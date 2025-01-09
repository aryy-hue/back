// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales');  // Sesuaikan dengan nama file controller

// Mendapatkan data penjualan
router.get('/', salesController.getSalesData);


// Rute untuk mendapatkan data ringkasan
router.get('/summary', salesController.getSummaryData);  // Menambahkan endpoint ringkasan


module.exports = router;
