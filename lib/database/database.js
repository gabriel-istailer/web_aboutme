import mysql from 'mysql2';

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

database.connect((error) => {
    if(error) {
        console.log('Error connecting to database: ', error);
    }
});

export default database;