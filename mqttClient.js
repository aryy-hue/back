const mqtt = require('mqtt');
const db = require('./connection');

// Ganti dengan URL broker MQTT yang digunakan
const brokerUrl = 'mqtt://broker.hivemq.com';
const topic = 'sensor/data/D-01';

const client = mqtt.connect(brokerUrl);

// Inisialisasi waktu terakhir data dipublikasikan
let lastPublishedTimestamp = null;

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', topic);
        } else {
            console.log(`Subscribed to topic: ${topic}`);
        }
    });
});

// Ketika pesan diterima dari broker
client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
        try {
            // Parsing data sensor yang diterima
            const sensorData = JSON.parse(message.toString());
            console.log('Data yang diterima:', sensorData);

            // Ambil suhu dan kelembapan
            const temperature = sensorData.temperature;
            const humidity = sensorData.humidity;

            if (temperature !== undefined && humidity !== undefined) {
                if (temperature !== null && !isNaN(temperature) && humidity !== null && !isNaN(humidity)) {
                    const timestamp = new Date();

                    // Menyimpan data suhu dan kelembapan ke dalam database
                    db.query('INSERT INTO kondisi (temperature, humidity, timestamp) VALUES (?, ?, ?)',
                        [temperature, humidity, timestamp],
                        (error, results) => {
                            if (error) {
                                console.error('Error inserting sensor data:', error);
                            } else {
                                console.log('Sensor data inserted into database:', { temperature, humidity });
                            }
                        });
                } else {
                    console.error('Invalid temperature or humidity data:', { temperature, humidity });
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }
});

// Fungsi untuk mempublikasikan data ke MQTT
const publishDataToMQTT = () => {
    // Ambil data hanya untuk tanggal hari ini dan pastikan data yang dipublikasikan lebih baru dari lastPublishedTimestamp
    const query = `
        SELECT * FROM kondisi
        WHERE DATE(timestamp) = CURDATE()
        ${lastPublishedTimestamp ? 'AND timestamp > ?' : ''}
        ORDER BY timestamp ASC
        LIMIT 1
    `;

    const queryParams = lastPublishedTimestamp ? [lastPublishedTimestamp] : [];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return;
        }

        if (results.length > 0) {
            const data = results[0];
            const payload = {
                temperature: data.temperature,
                humidity: data.humidity,
                timestamp: data.timestamp
            };

            // Publish data ke MQTT
            client.publish(topic, JSON.stringify(payload), (err) => {
                if (err) {
                    console.error('Error publishing to MQTT:', err);
                } else {
                    console.log('Published to MQTT:', payload);
                    // Update timestamp terakhir yang sudah dipublikasikan
                    lastPublishedTimestamp = data.timestamp;
                }
            });
        } else {
            console.log('No new data to publish.');
        }
    });
};

// Interval setiap 5 detik untuk mempublikasikan data ke MQTT
setInterval(publishDataToMQTT, 10000);

module.exports = client;
