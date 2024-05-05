const Sequelize = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const Recipe = sequelize.define('recipe', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ingredients: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  instructions: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

module.exports = Recipe;
