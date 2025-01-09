const db = require('../connection');

// Mendapatkan semua produk
const getAllProducts = (req, res) => {
    const query = 'SELECT id, name, price, stock, description, image_url FROM product';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({
            message: 'Products retrieved successfully',
            data: results,
        });
    });
};

// Mendapatkan produk berdasarkan ID
const getProductById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    const query = 'SELECT id, name, price, stock, description, image_url FROM product WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product retrieved successfully',
            data: results[0],
        });
    });
};

// Menambahkan produk baru
const addProduct = (req, res) => {
    const { name, price, stock, description, image_url } = req.body;

    // Validasi input
    if (!name || !price || !stock || !image_url) {
        return res.status(400).json({
            message: 'Name, price, stock, and image_url are required',
        });
    }

    const query = `
        INSERT INTO product (name, price, stock, description, image_url) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [name, price, stock, description, image_url], (err, results) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({
            message: 'Product added successfully',
            data: {
                id: results.insertId,
                name,
                price,
                stock,
                description,
                image_url,
            },
        });
    });
};

// Mengupdate produk
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description, image_url } = req.body;

    // Validasi input
    if (!id || !name || !price || !stock || !image_url) {
        return res.status(400).json({
            message: 'ID, name, price, stock, and image_url are required',
        });
    }

    const query = `
        UPDATE product 
        SET name = ?, price = ?, stock = ?, description = ?, image_url = ? 
        WHERE id = ?
    `;
    db.query(query, [name, price, stock, description, image_url, id], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
};

// Menghapus produk
const deleteProduct = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    const query = 'DELETE FROM product WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};