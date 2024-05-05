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
    host: 'localhost',
    user: 'val',
    password: '1',
    database: 'val'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection route
app.get('/testdb', (req, res) => {
    pool.query('SELECT * FROM users', (error, results, fields) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Database error' });
        } else {
            res.json({ message: 'Database connection successful', data: results });
        }
    });
});

// User registration endpoint
app.post('/auth/register', (req, res) => {
    const { email, password } = req.body;
    pool.getConnection((error, connection) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        connection.execute('SELECT * FROM users WHERE email = ?', [email], (error, existingUsers) => {
            if (error) {
                connection.release();
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            if (existingUsers.length > 0) {
                connection.release();
                res.status(400).json({ message: 'User with email already exists' });
                return;
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (error, result) => {
                connection.release();
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                res.status(201).json({ message: 'Registration successful!' });
            });
        });
    });
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

        // Respond with success message
        res.json({ message: 'Login successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
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

// For any other route, serve the 'index.html' file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
