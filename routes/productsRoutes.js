const express = require('express');
const router = express.Router();
const productController = require('../controllers/products'); // Pastikan nama file controller sesuai

// Endpoint untuk mendapatkan semua produk
router.get('/', productController.getAllProducts);

// Endpoint untuk mendapatkan produk berdasarkan ID
router.get('/:id', productController.getProductById);

// Endpoint untuk menambahkan produk baru
router.post('/add', productController.addProduct);

// Endpoint untuk mengupdate produk
router.put('/update/:id', productController.updateProduct);

// Endpoint untuk menghapus produk
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
