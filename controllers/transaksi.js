const db = require('../connection'); // Koneksi database

// Mendapatkan semua transaksi
const getAllTransactions = (req, res) => {
    const query = `
        SELECT t.id, t.product_id, p.name AS product_name, t.customer_id, t.quantity, 
               t.total_price, t.payment_method, t.date_time
        FROM transaksi t
        JOIN product p ON t.product_id = p.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: results,
        });
    });
};

// Mendapatkan transaksi berdasarkan ID
const getTransactionById = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT t.id, t.product_id, p.name AS product_name, t.customer_id, t.quantity, 
               t.total_price, t.payment_method, t.date_time
        FROM transaksi t
        JOIN product p ON t.product_id = p.id
        WHERE t.id = ?
    `;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: results[0],
        });
    });
};

// Menambahkan transaksi baru
const createTransaction = (req, res) => {
    const { product_id, customer_id, quantity, total_price, payment_method } = req.body;

    // Validasi input
    if (!product_id || !quantity || !total_price || !payment_method) {
        return res.status(400).json({
            message: 'Product ID, quantity, total price, and payment method are required',
        });
    }

    const query = `
        INSERT INTO transaksi (product_id, customer_id, quantity, total_price, payment_method, date_time) 
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(query, [product_id, customer_id || null, quantity, total_price, payment_method], (err, results) => {
        if (err) {
            console.error('Error inserting transaction:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                id: results.insertId,
                product_id,
                customer_id,
                quantity,
                total_price,
                payment_method,
            },
        });
    });
};

// Mengupdate transaksi berdasarkan ID
const updateTransaction = (req, res) => {
    const { id } = req.params;
    const { product_id, customer_id, quantity, total_price, payment_method } = req.body;

    // Validasi input
    if (!id || !product_id || !quantity || !total_price || !payment_method) {
        return res.status(400).json({
            message: 'Transaction ID, product ID, quantity, total price, and payment method are required',
        });
    }

    const query = `
        UPDATE transaksi 
        SET product_id = ?, customer_id = ?, quantity = ?, total_price = ?, payment_method = ?
        WHERE id = ?
    `;
    db.query(query, [product_id, customer_id, quantity, total_price, payment_method, id], (err, results) => {
        if (err) {
            console.error('Error updating transaction:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({
            message: 'Transaction updated successfully',
        });
    });
};

// Menghapus transaksi berdasarkan ID
const deleteTransaction = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const query = 'DELETE FROM transaksi WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    });
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
