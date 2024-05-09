const mysql = require('mysql2/promise');
const assert = require('assert');

// Database configuration
const dbConfig = {
    host: '127.0.0.1',
    user: 'val',
    password: '1',
    database: 'val'
};

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
};

// Test to check if the database connection is successful
const testDatabaseConnection = async () => {
    try {
        const connection = await connectToDatabase();
        assert.ok(connection, "Database connection is successful");
        await connection.end();
        console.log("Database connection test passed");
    } catch (error) {
        console.error("Database connection test failed:", error);
    }
};

// Test to check if the tables are created successfully
const testTableCreation = async () => {
    try {
        const connection = await connectToDatabase();
        // Check if the users table exists
        const [users] = await connection.execute("SHOW TABLES LIKE 'users'");
        assert.strictEqual(users.length, 1, "Users table should exist");
        // Check if the recipes table exists
        const [recipes] = await connection.execute("SHOW TABLES LIKE 'recipes'");
        assert.strictEqual(recipes.length, 1, "Recipes table should exist");
        await connection.end();
        console.log("Table creation test passed");
    } catch (error) {
        console.error("Table creation test failed:", error);
    }
};

// Run tests
const runTests = async () => {
    try {
        await testDatabaseConnection();
        await testTableCreation();
    } catch (error) {
        console.error("Error running tests:", error);
    }
};

runTests();
