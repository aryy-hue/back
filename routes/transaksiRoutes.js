const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksi');

// Route: Mendapatkan semua transaksi
router.get('/', transaksiController.getAllTransactions);

// Route: Mendapatkan transaksi berdasarkan ID
router.get('/:id', transaksiController.getTransactionById);

// Route: Menambahkan transaksi baru
router.post('/add', transaksiController.createTransaction);

// Route: Mengupdate transaksi berdasarkan ID
router.put('/update/:id', transaksiController.updateTransaction);

// Route: Menghapus transaksi berdasarkan ID
router.delete('/delete/:id', transaksiController.deleteTransaction);

module.exports = router;
