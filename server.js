const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Recipe = require('./models/Recipe');

const app = express();
const PORT = process.env.PORT || 5006;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, 'Templates', '')));

app.use(bodyParser.json());

// Connect to the mysql database

const dbConfig = {
    host: '127.0.0.1',
    user: 'val',
    password: '1',
    database: 'val'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize connection object
let connection;

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

// Define the database schema
const createTables = async () => {
    try {
        const connection = await pool.getConnection();
        // Create users table
        await connection.execute(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )`);
        // Create recipes table
        await connection.execute(`CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            ingredients TEXT,
            instructions TEXT,
            videoUrl VARCHAR(255)
        )`);
        connection.release();
        console.log("Database tables created successfully");
    } catch (error) {
        console.error("Error creating database tables:", error);
    }
};

// Call createTables function to initialize database schema
createTables().catch(console.error);


// User registration endpoint
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Check if the email already exists in the database
        const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            connection.release(); // Release the connection
            return res.status(400).json({ message: 'User with email already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert the new user into the database
        const [result] = await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        connection.release(); // Release the connection

        // Generate dynamic dashboard URL using email
        const dashboardUrl = `/dashboard/${encodeURIComponent(email)}`;

        // Respond with success message and dashboard URL
        res.status(201).json({ message: 'Registration successful!', dashboardUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login endpoint
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();
        
        // Check if the user with the provided email exists
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Compare the hashed password with the provided password
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate dynamic dashboard URL using email
        const dashboardUrl = `/dashboard/${encodeURIComponent(email)}`;

        // Respond with success message and dashboard URL
        res.json({ message: 'Login successful!', dashboardUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
});

// Serve the dashboard.html page for the dashboard URL
app.get('/dashboard/:email', (req, res) => {
    const email = req.params.email;
    // Serve the dashboard.html file
    res.sendFile(path.join(__dirname, 'Templates', 'index.html'));
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Recipe search endpoint
app.get('/recipes/search', async (req, res) => {
    const searchQuery = req.query.search || '';
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();
        const [recipes] = await connection.execute('SELECT * FROM recipes WHERE title LIKE ? OR ingredients LIKE ? OR instructions LIKE ?', [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]);
        res.json({ recipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
});

// Add a new recipe
app.post('/recipes/add', async (req, res) => {
    const { title, ingredients, instructions } = req.body;

    try {
        // Insert the new recipe into the database without associating it with a specific user
        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)', [title, ingredients, instructions]);
        connection.release(); // Release the connection
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to handle updating a recipe
app.put('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute('UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?', [title, ingredients, instructions, id]);
        connection.release(); // Release the connection
        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to handle deleting a recipe
app.delete('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM recipes WHERE id = ?', [id]);
        connection.release(); // Release the connection
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Upload a recipe video or add recipe URL
app.post('/recipes/:id/upload', upload.single('recipeVideo'), async (req, res) => {
    const { id } = req.params;
    const recipeVideo = req.file;
    try {
        const connection = await pool.getConnection();
        await connection.execute('UPDATE recipes SET videoUrl = ? WHERE id = ?', [recipeVideo.path, id]);
        connection.release(); // Release the connection
        res.json({ message: 'Recipe video uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// For any other route, serve the 'index.html' file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
