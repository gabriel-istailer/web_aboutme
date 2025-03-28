import database from "../database/database";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    
    async getUserByToken(token) {
        try {
            const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [tokenDecoded.email]);
            if(!results.length) {
               return false; 
            }
            return results[0];
        } catch (error) {
            console.log('Erro na função getUser do UserController:', error);
        }
    }

    async verifyUser(email) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            return (results.length > 0);
        } catch(error) {
            console.log('Erro na função verifyUser do UserController: ', error);
        }
    }

    async createUser(user) {
        try {
            const passwordEncrypted = await bcrypt.hash(user.password, 10);
            const sql = `INSERT INTO ${process.env.DATABASE_USERS_TABLE} (name, email, password, profile_image_path) VALUES (?, ?, ?, ?)`;
            await database.promise().query(sql, [user.name, user.email, passwordEncrypted, '/users-profiles/default-profile.jpg']);
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Erro na função createUser do UserController: ', error);
        }
    }
    
}

export default new UserController;