import database from "../database/database";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {

    async create(user) {
        try {
            const passwordEncrypted = await bcrypt.hash(user.password, 10);
            const sql = `INSERT INTO ${process.env.DATABASE_USERS_TABLE} (name, email, password, profile_image_path) VALUES (?, ?, ?, ?)`;
            await database.promise().query(sql, [user.name, user.email, passwordEncrypted, '/users-profiles/default-profile.jpg']);
            const token = jwt.sign(user.email, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Error in the createUser function of the UserController: ', error);
            return false;
        }
    }

    async createToken(email) {
        try {
            const token = jwt.sign(email, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            console.log('Error in createUserToken function of UserController: ', error);
            return false;
        }
    }

    async comparePassword(email, password) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            if (!results.length) {
                return false;
            }
            return await bcrypt.compare(password, results[0].password);
        } catch (error) {
            console.log('Error in verifyUserPassword function of UserController: ', error);
            return false;
        }
    }

    async get(userData, isToken) {
        try {
            if(isToken) {
                userData = jwt.verify(userData, process.env.JWT_SECRET);
                userData = userData.email;
            }
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [userData]);
            if(!results.length) {
                return false;
            }
            const user = results[0];
            delete user.id_users;
            delete user.password;
            return user;
        } catch (error) {
            console.log('Error in get function of UserController: ', error);
            return false;
        }
    }

    async updatePassword(newPassword, userData, userDataIsToken) {
        try {
            if(userDataIsToken) {
                userData = jwt.verify(userData, process.env.JWT_SECRET);
                userData = userData.email;
            }

            const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);

            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET password = ? WHERE email = ?`;
            await database.promise().query(sql, [newPasswordEncrypted, userData]);

        } catch (error) {
            console.log('Error in updatePassword function of UserController: ', error);
        }
    }

}

export default new UserController;