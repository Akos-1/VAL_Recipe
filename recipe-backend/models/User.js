const Sequelize = require('sequelize');
const db = require('../../config/database'); // Adjust the path as needed

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;
