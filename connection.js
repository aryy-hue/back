// const mysql = require ('mysql');

// const db = mysql.createConnection({
//     host : "localhost", 
//     user: "root",
//     password: "",
//     database : "vendingmachine_project"
// })

// db.connect((err) => {
//     if (err) throw err;
//     console.log('Database connected');
//   });

// module.exports = db;

// connection.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vendingmachine_project"
}); 

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database as ID ' + db.threadId);
});

module.exports = db;


