const mysql = require('mysql2/promise');

// Connect to the mysql database
const dbConfig = {
    host: 'localhost',
    user: 'val',
    password: '1',
    database: 'val'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Define the User model
const User = {
  async findOne(options) {
    try {
      const [rows, fields] = await pool.query('SELECT * FROM users WHERE ?', [options]);
      return rows[0]; // Return the first user found
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  async create(data) {
    const { email, password } = data;
    try {
      await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};

module.exports = User;
