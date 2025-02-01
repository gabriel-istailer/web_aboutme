import mysql from 'mysql2';

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

database.connect((error) => {
    if(error) {
        console.log('Erro ao se conectar com o banco de dados: ', error);
    } else {
        console.log('Conexão com banco de dados bem-sucedida.');
    }
});

export default database;