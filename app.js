const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express app
const app = express();
app.use(express.json());

// Configure database connection
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
  host: 'localhost'
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Sync model with database
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.create({ username, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ username, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
