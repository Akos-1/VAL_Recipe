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
app.use(express.static(path.join(__dirname, '')));

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

let connection;

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
    res.sendFile(path.join(__dirname, 'dashboard.html'));
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
    }
});

// Add a new recipe
app.post('/recipes/add', async (req, res) => {
    const { title, ingredients, instructions, userId } = req.body;
    try {
        await connection.execute('INSERT INTO recipes (title, ingredients, instructions, userId) VALUES (?, ?, ?, ?)', [title, ingredients, instructions, userId]);
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a recipe
app.put('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    try {
        await connection.execute('UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?', [title, ingredients, instructions, id]);
        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await connection.execute('DELETE FROM recipes WHERE id = ?', [id]);
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
        await connection.execute('UPDATE recipes SET videoUrl = ? WHERE id = ?', [recipeVideo.path, id]);
        res.json({ message: 'Recipe video uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Endpoint to fetch user-specific data for the dashboard
app.get('/api/dashboard/:email', async (req, res) => {
    const { email } = req.params;
    try {
        // Get user profile information
        const [user] = await connection.execute('SELECT id, email FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = user[0].id;

        // Fetch recent activity for the user
        const [activity] = await connection.execute('SELECT * FROM activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [userId]);

        // Fetch user's recipes
        const [recipes] = await connection.execute('SELECT * FROM recipes WHERE userId = ?', [userId]);

        // Combine all fetched data and respond
        const dashboardData = {
            user: user[0],
            activity,
            recipes
        };
        res.json(dashboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to handle adding a new recipe
app.post('/api/recipes/add', async (req, res) => {
    const { title, ingredients, instructions, userId } = req.body;
    try {
        await connection.execute('INSERT INTO recipes (title, ingredients, instructions, userId) VALUES (?, ?, ?, ?)', [title, ingredients, instructions, userId]);
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
        await connection.execute('UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?', [title, ingredients, instructions, id]);
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
        await connection.execute('DELETE FROM recipes WHERE id = ?', [id]);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// For any other route, serve the 'index.html' file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
