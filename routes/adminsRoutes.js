const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admins');  // Mengimpor controller admin yang benar

// Endpoint untuk mengambil semua data admin
router.get('/', adminController.getAllAdmins);

// Endpoint untuk menambahkan admin baru / registrasi
router.post('/add', adminController.addAdmin);

// Endpoint untuk mengupdate data admin
router.put('/update/:id', adminController.updateAdmin);

// Endpoint untuk menghapus admin
router.delete('/delete/:id', adminController.deleteAdmin);

//login
router.post('/login', adminController.loginAdmin);

router.post('/logout', adminController.logoutAdmin);

module.exports = router;
