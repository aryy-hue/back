const db = require('../connection');
const bcrypt = require('bcrypt');

// Menampilkan semua data customer
const getAllCustomers = (req, res) => {
    db.query('SELECT * FROM customer', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results);
    });
};

// Menambahkan customer baru (registrasi)
const addCustomer = (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validasi input untuk memastikan semua field terisi
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    // Trim input untuk menghindari spasi tambahan
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    // Hash password sebelum disimpan ke database
    bcrypt.hash(trimmedPassword, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err });
        }

        // Periksa panjang hash bcrypt (biasanya 60 karakter)
        if (hashedPassword.length > 255) {
            return res.status(400).json({ message: 'Hashed password is too long to store' });
        }

        // Menyimpan customer baru dengan password yang sudah di-hash
        const query = 'INSERT INTO customer (name, email, phone, password) VALUES (?, ?, ?, ?)';
        db.query(query, [trimmedName, trimmedEmail, trimmedPhone, hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({
                message: 'Customer registered successfully',
                data: { name: trimmedName, email: trimmedEmail, phone: trimmedPhone }
            });
        });
    });
};


// Login customer
const loginCustomer = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Cek apakah email ada di database
    const query = 'SELECT * FROM customer WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = results[0];

        // Cek password
        bcrypt.compare(password, customer.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing password', error: err });
            }
            if (!match) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            res.status(200).json({
                message: 'Login successful',
                data: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone }
            });
        });
    });
};

// Mengupdate data customer
const updateCustomer = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    // Hash password sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err });
        }

        const query = 'UPDATE customer SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?';
        db.query(query, [name, email, phone, hashedPassword, id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            res.status(200).json({
                message: 'Customer updated successfully',
                data: { id, name, email, phone }
            });
        });
    });
};

//menghapus 
const deleteCustomer = (req, res) => {
    const { id } = req.params;

    // Hapus data terkait di tabel transaksi terlebih dahulu
    const deleteTransactionQuery = 'DELETE FROM transaksi WHERE customer_id = ?';
    db.query(deleteTransactionQuery, [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting related transactions', error: err });
        }

        // Hapus data customer setelah transaksi terkait dihapus
        const deleteCustomerQuery = 'DELETE FROM customer WHERE id = ?';
        db.query(deleteCustomerQuery, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.status(200).json({ message: 'Customer deleted successfully' });
        });
    });
};


module.exports = {
    getAllCustomers,
    addCustomer,
    loginCustomer,
    updateCustomer,
    deleteCustomer
};
