const express = require('express');
const { Client } = require('pg');

const connectionString = 'postgresql://username:password@localhost:5432/my_database';
const client = new Client({ connectionString });

const app = express();
const port = 3000;

app.use(express.json());

async function connect() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Create user
app.post('/users', async (req, res) => {
    const { username, email } = req.body;
    try {
        const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
        const values = [username, email];
        const result = await client.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { username, email } = req.body;
    try {
        const query = 'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *';
        const values = [username, email, id];
        const result = await client.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];
        await client.query(query, values);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Start the server
async function startServer() {
    await connect();
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

startServer();
