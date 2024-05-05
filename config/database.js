const Sequelize = require('sequelize');

// Initialize Sequelize with SQLite dialect
const sequelize = new Sequelize({
  dialect: 'mysql',
  storage: './recipes.db' // Path to your SQLite database file
});

module.exports = sequelize;
