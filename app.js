const { Sequelize, DataTypes } = require('sequelize');

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

// CRUD operations
async function createUser(username, email) {
  try {
    const user = await User.create({ username, email });
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
}

async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
}

async function updateUser(id, username, email) {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update({ username, email });
    return user;
  } catch (error) {
    throw new Error('Error updating user');
  }
}

async function deleteUser(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return user;
  } catch (error) {
    throw new Error('Error deleting user');
  }
}

// Testing
async function test() {
  try {
    // Sync model with database
    await sequelize.sync({ force: true });

    // Create user
    const newUser = await createUser('john_doe', 'john@example.com');
    console.log('Created User:', newUser.toJSON());

    // Get all users
    const allUsers = await getUsers();
    console.log('All Users:', allUsers.map(user => user.toJSON()));

    // Update user
    const updatedUser = await updateUser(newUser.id, 'john_smith', 'john@example.com');
    console.log('Updated User:', updatedUser.toJSON());

    // Delete user
    const deletedUser = await deleteUser(newUser.id);
    console.log('Deleted User:', deletedUser.toJSON());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
