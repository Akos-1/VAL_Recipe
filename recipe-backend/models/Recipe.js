const Sequelize = require('sequelize');
const db = require('../config/database');

const Recipe = db.define('recipe', {
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