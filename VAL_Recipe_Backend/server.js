const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// Parse JSON requests
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '')));

// Cuurent recipe data (we will connect to a database later)
const recipes = [
  { id: 1, name: 'Waakye' },
  { id: 2, name: 'Amala' },
  { id: 3, name: 'Attieke' },
  { id: 4, name: 'Thieboudienne' },
  { id: 5, name: 'Granat Soup' },
  { id: 6, name: 'Kuli-kuli' },
];

// In-memory user data (to be replaced this with a database)
const users = [];

// Search recipes endpoint
app.post('/api/search-recipes', (req, res) => {
  const { searchTerm } = req.body;
  const results = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  res.json(results);
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username and check the password
  const user = users.find(user => user.username === username);

  if (user && user.password === password) {
    // Authentication successful
    res.json({ success: true, message: 'Login successful' });
  } else {
    // Authentication failed
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username is already taken
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    res.status(400).json({ success: false, message: 'Username already taken' });
  } else {
    // Create a new user
    const newUser = { username, email, password };
    users.push(newUser);

    res.json({ success: true, message: 'Registration successful' });
  }
});

// For any other route, serve the 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

