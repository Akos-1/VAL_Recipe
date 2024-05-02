const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { Recipe, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(bodyParser.json());


// User registration endpoint
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login endpoint
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
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
        const recipes = await Recipe.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { title: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { ingredients: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { instructions: { [Sequelize.Op.like]: `%${searchQuery}%` } }
                ]
            }
        });
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
        const recipe = await Recipe.create({ title, ingredients, instructions, userId });
        res.status(201).json({ message: 'Recipe added successfully', recipe });
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
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        await recipe.save();
        res.json({ message: 'Recipe updated successfully', recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        await recipe.destroy();
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
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        recipe.videoUrl = recipeVideo.path; // Assuming you save the file path in the database
        await recipe.save();
        res.json({ message: 'Recipe video uploaded successfully', recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});