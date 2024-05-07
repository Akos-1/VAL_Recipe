const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport local strategy for user login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// User registration endpoint
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login endpoint
app.post('/auth/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful!', user: req.user });
});

// Serve the dashboard.html page for the dashboard URL
app.get('/dashboard', (req, res) => {
    // Serve the dashboard.html file
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Add a new recipe
app.post('/recipes/add', isAuthenticated, async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    const userId = req.user.id;

    try {
        await connection.execute('INSERT INTO recipes (title, ingredients, instructions, userId) VALUES (?, ?, ?, ?)', [title, ingredients, instructions, userId]);
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a recipe
app.put('/recipes/:id', isAuthenticated, async (req, res) => {
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
app.delete('/recipes/:id', isAuthenticated, async (req, res) => {
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
