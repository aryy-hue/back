const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');

// Menampilkan semua data customer
router.get('/', customerController.getAllCustomers);

// Menambahkan customer baru (registrasi)
router.post('/register', customerController.addCustomer);

// Login customer
router.post('/login', customerController.loginCustomer);

// Mengupdate data customer
router.put('/update/:id', customerController.updateCustomer);

// Menghapus customer
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;
