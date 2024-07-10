const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = 3001; // Changez le port ici

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Change to your MySQL root password
    database: 'projeticp'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Create users table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`, (err, result) => {
    if (err) {
        throw err;
    }
    console.log('Users table created or already exists');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                res.json({ success: true, message: 'Registration successful' });
            });
        });
    });
});

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve dashboard page
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
