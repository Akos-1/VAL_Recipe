// testDatabase.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite
const app = express();

// Connect to the SQLite database
const dbPath = '/root/VAL_Recipe/recipe-backend/recipes.db'; // Adjust path as necessary
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Test database connection route
app.get('/testdb', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Database error' });
        } else {
            res.json({ message: 'Database connection successful', data: rows });
        }
    });
});

app.listen(5006, () => {
    console.log('Server is running on port 5006');
});

