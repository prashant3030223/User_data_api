require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MASTER_AUTH_KEY = process.env.MASTER_AUTH_KEY;

// Middleware to check Master Authorization Key
const authenticateMasterKey = (req, res, next) => {
    const masterKey = req.header('x-master-auth') ||
        (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''));

    if (!masterKey || masterKey !== MASTER_AUTH_KEY) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Missing or invalid Master Authorization Key. Use x-master-auth header.'
        });
    }

    next();
};

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'User Data API is running',
        version: '1.0.0',
        endpoints: {
            users: '/users',
            userById: '/users/:id'
        },
        auth: 'Use x-master-auth header or Authorization: Bearer <key>'
    });
});

// Load user data
const usersDataPath = path.join(__dirname, 'users.json');
let users = [];

try {
    const data = fs.readFileSync(usersDataPath, 'utf8');
    users = JSON.parse(data);
} catch (err) {
    console.error('Error reading users.json:', err);
    process.exit(1);
}

// Routes
app.get('/users', authenticateMasterKey, (req, res) => {
    res.json({
        total: users.length,
        users: users
    });
});

app.get('/users/:id', authenticateMasterKey, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`MASTER AUTHORIZATION KEY: ${MASTER_AUTH_KEY}`);
    console.log(`Headers supported: 'x-master-auth' or 'Authorization: Bearer <key>'`);
});
