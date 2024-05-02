const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/search', async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

