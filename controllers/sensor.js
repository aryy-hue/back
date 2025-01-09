const db = require('../connection');

// Get all sensor data
exports.getSensorData = (req, res) => {
    db.query('SELECT * FROM kondisi ORDER BY timestamp DESC', (error, results) => {
        if (error) {
            console.error('Error fetching sensor data:', error); // Tambahkan ini untuk log error
            return res.status(500).json({ error: 'Error fetching sensor data' });
        }
        res.status(200).json(results);
    });
};


// Save new sensor data
exports.addSensorData = (req, res) => {
    const { temperature, humidity } = req.body;
    const timestamp = new Date();

    db.query('INSERT INTO kondisi(temperature, humidity, timestamp) VALUES (?, ?, ?)', [temperature, humidity, timestamp], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error saving sensor data' });
        }
        res.status(201).json({ id: results.insertId, temperature, humidity, timestamp });
    });
};
