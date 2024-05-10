const mysql = require('mysql2/promise');
const assert = require('assert');

describe('Database Tests', () => {
  let connection;

  before(async () => {
    // Connect to the test database
    const dbConfig = {
      host: '127.0.0.1',
      user: 'val',
      password: '1',
      database: 'val'
    };

    connection = await mysql.createConnection(dbConfig);
  });

  after(async () => {
    // Close the database connection after all tests
    if (connection) {
      await connection.end();
    }
  });

  it('should insert a new user into the users table during registration', async () => {
    // Execute registration query
    await connection.execute(`INSERT INTO users (email, password) VALUES ('john@example.com', 'defaultpassword')`);
    
    // Check if user is inserted
    const [rows] = await connection.execute(`SELECT * FROM users WHERE email = 'john@example.com'`);
    assert.strictEqual(rows.length, 1, 'User not inserted during registration');
  });

  // Add more tests for other endpoints as needed
});
