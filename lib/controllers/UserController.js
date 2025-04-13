import database from "../database/database";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    
    async create(user) {
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

    async getByToken(token) {
        try {
            const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [tokenDecoded.email]);
            if(!results.length) {
               return false; 
            }
            const user = results[0];
            delete user.password;
            delete user.id_users;
            return user;
        } catch (error) {
            console.log('Error in the getUserByToken function of the UserController: ', error);
        }
    }

    async getByEmail(email) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            if(!results.length) {
                return false;
            }
            const user = results[0];
            delete user.password;
            delete user.id_users;
            return user;
        } catch(error) {
            console.log('Error in verifyUser function of UserController: ', error);
        }
    }
    
    async comparePassword(email, password) {
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

    async createToken(email) {
        try {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Error in createUserToken function of UserController: ', error);
        }
    }

}

export default new UserController;