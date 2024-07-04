import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

function connectToDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: 27674,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    connection.connect((error) => {
        if (error) {
            console.error(':( Error connecting to MySQL database:', error);
        } else {
            console.log(':) Connected to MySQL database!');
        }
    });

    return connection;
}
const connection = connectToDatabase();
export default connection;