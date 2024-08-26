import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

function createDatabasePool() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: 27674,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,  // Adjust the connection limit based on your needs
        queueLimit: 0
    });

    pool.getConnection((error, connection) => {
        if (error) {
            console.error(':( Error connecting to MySQL database:', error);
        } else {
            console.log(':) Connected to MySQL database!');
            connection.release(); // Release the connection back to the pool
        }
    });

    return pool;
}

const pool = createDatabasePool();
export default pool;
