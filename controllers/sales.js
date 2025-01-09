const db = require('../connection');  // Koneksi ke database

let isConnected = false;

// Fungsi untuk mengambil data penjualan
exports.getSalesData = (req, res) => {
    if (!isConnected) {
        console.log("Koneksi ke database berhasil, menjalankan query...");
        isConnected = true;  // Tandai bahwa pesan sudah dicetak
    }
    
    const query = `
      SELECT 
        DATE(date_time) AS sale_date,
        HOUR(date_time) AS sale_hour,
        SUM(quantity) AS total_quantity
      FROM transaksi
      GROUP BY sale_date, sale_hour
      ORDER BY sale_date DESC, sale_hour DESC;
    `;


    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching sales data:', err);
        return res.status(500).json({ error: 'Error fetching sales data' });
      }
      res.json(results);
    });
};

// Fungsi untuk mendapatkan data ringkasan
exports.getSummaryData = (req, res) => {
  const summaryQuery = `
    SELECT 
      (SELECT COALESCE(SUM(quantity), 0) FROM transaksi WHERE DATE(date_time) = CURDATE()) AS total_quantity_today,
      (SELECT COALESCE(SUM(total_price), 0) FROM transaksi WHERE DATE(date_time) = CURDATE()) AS total_revenue_today,
      (SELECT COALESCE(AVG(temperature), 0) FROM kondisi WHERE DATE(timestamp) = CURDATE()) AS avg_temperature_today,
      (SELECT COALESCE(AVG(humidity), 0) FROM kondisi WHERE DATE(timestamp) = CURDATE()) AS avg_humidity_today;
  `;

  db.query(summaryQuery, (err, results) => {
    if (err) {
      console.error('Error fetching summary data:', err);
      return res.status(500).json({ error: 'Error fetching summary data' });
    }

    // Pastikan hasil dikembalikan meskipun kosong
    res.json(results[0] || {
      total_quantity_today: 0,
      total_revenue_today: 0,
      avg_temperature_today: 0,
      avg_humidity_today: 0,
    });
  });
};