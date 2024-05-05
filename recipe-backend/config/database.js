const Sequelize = require('sequelize');

const sequelize = new Sequelize('val', 'val', '1', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
