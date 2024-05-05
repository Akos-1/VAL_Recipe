const mysql = require('mysql');

// MySQL connection configuration
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
};

// Create a connection to the MySQL server
const connection = mysql.createConnection(connectionConfig);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server as root user');
  
  // Register a person
  registerPerson(connection);
});

// Function to register a person
function registerPerson(connection) {
  const person = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  };

  // Insert the person into the database
  connection.query('INSERT INTO persons SET ?', person, (err, result) => {
    if (err) {
      console.error('Error registering person:', err);
      return;
    }
    console.log('Person registered successfully:', result);
    
    // Close the connection
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err);
        return;
      }
      console.log('MySQL connection closed');
    });
  });
}
