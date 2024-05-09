const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

const dbConfig = {
    host: 'localhost',
    user: 'val',
    password: '1',
    database: 'val'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection route
app.get('/testdb', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute a query
        const [rows, fields] = await connection.query('SELECT * FROM users');
        // Release the connection
        connection.release();
        res.json({ message: 'Database connection successful', data: rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.listen(5006, () => {
    console.log('Server is running on port 5006');
});
