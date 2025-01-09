const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./connection'); // Pastikan file ini terkoneksi dengan database
const productRoutes = require('./routes/productsRoutes'); // Route untuk produk
const adminRoutes = require('./routes/adminsRoutes'); // Route untuk admin
const sensorRoutes = require('./routes/sensorRoutes'); // Route untuk sensor
const salesRoutes = require('./routes/salesRoutes'); // Route untuk sales
const customersRoutes = require('./routes/customersRoutes'); // Route untuk customer
const transaksiRoutes = require('./routes/transaksiRoutes'); // Route untuk transaksi

const port = 3000;

app.use(cors());
app.use(express.json());

// Log setiap request untuk debugging
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Endpoint dasar untuk cek server
app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

// Endpoint lain (contoh)
app.get('/greet', (req, res) => {
    res.send('Hello! This is another endpoint.');
});

// Routes untuk admin
app.use('/api/admins', adminRoutes);

// Routes untuk produk
app.use('/api/products', productRoutes);

// Routes untuk customer
app.use('/api/customers', customersRoutes);

// Routes untuk sensor
app.use('/api/sensors', sensorRoutes);

// Routes untuk transaksi
app.use('/api/transaksi', transaksiRoutes);

// Routes untuk penjualan
app.use('/api/sales', salesRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
