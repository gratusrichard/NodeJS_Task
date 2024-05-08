const { Client } = require('pg');

const connectionString = 'postgresql://postgres:root@localhost:5432';
const client = new Client({ connectionString });

async function createDatabaseAndSchema() {
    try {
        await client.connect();

        await client.query('CREATE DATABASE my_database');

        const dbClient = new Client({ connectionString: `${connectionString}/my_database` });
        await dbClient.connect();

        await dbClient.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            )
        `);

        console.log('Database and schema created successfully.');
    } catch (error) {
        console.error('Error creating database and schema:', error);
    } finally {
        await client.end();
    }
}

createDatabaseAndSchema();
