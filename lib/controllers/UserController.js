import database from "../database/database";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    
    async createUser(user) {
        try {
            const passwordEncrypted = await bcrypt.hash(user.password, 10);
            const sql = `INSERT INTO ${process.env.DATABASE_USERS_TABLE} (name, email, password, profile_image_path) VALUES (?, ?, ?, ?)`;
            await database.promise().query(sql, [user.name, user.email, passwordEncrypted, '/users-profiles/default-profile.jpg']);
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Error in the createUser function of the UserController: ', error);
        }
    }

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
            console.log('Error in the getUserByToken function of the UserController: ', error);
        }
    }

    async verifyUserEmail(email) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            return (results.length > 0);
        } catch(error) {
            console.log('Error in verifyUser function of UserController: ', error);
        }
    }
    
    async verifyUserPassword(email, password) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            if(!results.length) {
                return false;
            }
            return await bcrypt.compare(password, results[0].password);
        } catch (error) {
            console.log('Error in verifyUserPassword function of UserController: ', error);
        }
    }

    async createUserToken(email) {
        try {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Error in createUserToken function of UserController: ', error);
        }
    }

}

export default new UserController;