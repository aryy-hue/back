const db = require('../connection');
const bcrypt = require('bcrypt');

// Menampilkan semua data admin
const getAllAdmins = (req, res) => {
    db.query('SELECT * FROM admins', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results);
    });
};

// Menambahkan admin baru
const addAdmin = (req, res) => {
    const { username, email, password } = req.body;

    // Validasi: Pastikan username, email, dan password ada
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Hash password sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err });
        }

        // Menyimpan admin baru dengan username, email, dan password yang sudah di-hash
        const query = 'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({
                message: 'Admin added successfully',
                data: { username, email }
            });
        });
    });
};


// Mengupdate data admin
const updateAdmin = (req, res) => {
    const { id } = req.params;  // Mengambil ID dari URL parameter
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Hash password sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err });
        }

        // Query untuk update admin berdasarkan id
        const query = 'UPDATE admins SET username = ?, email = ?, password = ? WHERE id = ?';
        db.query(query, [username, email, hashedPassword, id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            // Jika tidak ada baris yang terpengaruh, berarti admin dengan id tidak ditemukan
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.status(200).json({
                message: 'Admin updated successfully',
                data: { id, username, email }
            });
        });
    });
};

// Menghapus admin
const deleteAdmin = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM admins WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    });
};

// Login admin
const loginAdmin = (req, res) => {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query untuk mencari admin berdasarkan email
    const query = 'SELECT * FROM admins WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        // Jika admin tidak ditemukan
        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = results[0];

        // Membandingkan password yang diinput dengan yang di database
        bcrypt.compare(password, admin.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing password', error: err });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Login berhasil
            res.status(200).json({
                message: 'Login successful',
                data: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email
                }
            });
        });
    });
};
const logoutAdmin = (req, res) => {
    // Menghapus token dari cookies (jika menggunakan cookies untuk menyimpan token)
    res.clearCookie('auth_token');  // Ganti 'auth_token' dengan nama cookie yang digunakan

    // Mengirimkan response bahwa logout berhasil
    res.status(200).json({
        message: 'Logout successful'
    });
};

module.exports = {
    getAllAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin,  // Menambahkan logout ke module ekspor
};
