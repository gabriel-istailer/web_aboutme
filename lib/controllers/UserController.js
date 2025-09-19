import database from "../database/database";
import deleteUserOldProfileImage from "../middlewares/deleteUserOldProfileImage";
import uploadUserProfileImage from "../middlewares/uploadUserProfileImage";

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
            const token = jwt.sign({email}, process.env.JWT_SECRET);
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
            delete user.password;
            user.birth_date = user.birth_date ? user.birth_date.toISOString().split("T")[0] : undefined;
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

    async updateProfileImage(email, file) {
        try {
            const sql1 = `SELECT profile_image_path FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql1, [email]);
            const oldImagePath = results[0]?.profile_image_path;
            if(!oldImagePath.includes('default-profile')) {
                await deleteUserOldProfileImage(oldImagePath);
            }

            const imagePath = await uploadUserProfileImage(file);
            const sql2 = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET profile_image_path = ? WHERE email = ?`;
            await database.promise().query(sql2, [imagePath, email]);
            return imagePath;
        } catch (error) {
            console.log('Error in updateProfileImage function of UserController: ', error);
        }
    }

    async updateEmail(newEmail, currentEmail) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET email = ? WHERE email = ?`;
            await database.promise().query(sql, [newEmail, currentEmail]);
        } catch (error) {
            console.log('Error in updateEmail function of UserController: ', error);
        }
    }

    async updateName(name, email) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET name = ? WHERE email = ?`;
            await database.promise().query(sql, [name, email]);
        } catch (error) {
            console.log('Error in updateName function of UserController: ', error);
        }
    }

    async updateProfession(profession, email) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET profession = ? WHERE email = ?`;
            await database.promise().query(sql, [profession, email]);
        } catch (error) {
            console.log('Error in updateProfession function of UserController: ', error);
        }
    }

    async updateBiography(biography, email) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET biography = ? WHERE email = ?`;
            await database.promise().query(sql, [biography, email]);
        } catch (error) {
            console.log('Error in updateBiography function of UserController: ', error);
        }
    }

    async updateGender(gender, email) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET gender = ? WHERE email = ?`;
            await database.promise().query(sql, [gender, email]);
        } catch (error) {
            console.log('Error in updateGender function of UserController: ', error);
        }
    }

    async updateBirthDateAndAge(birthDate, email) {
        try {
            const today = new Date();
            const birth = new Date(birthDate);

            let age = today.getFullYear() - birth.getFullYear();
            const currentMonth = today.getMonth();
            const birthMonth = birth.getMonth();

            if(currentMonth < birthMonth || (currentMonth === birthMonth && today.getDate() < birth.getDate())) {
                age--;
            }

            const sql1 = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET birth_date = ? WHERE email = ?`;
            await database.promise().query(sql1, [birthDate, email]);

            const sql2 = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET age = ? WHERE email = ?`;
            await database.promise().query(sql2, [age, email]);

            return age;
        } catch (error) {
            console.log('Error in updateBirthDate function of UserController: ', error);
        }
    }

    async updateHobbies(hobbies, email) {
        try {
            const sql = `UPDATE ${process.env.DATABASE_USERS_TABLE} SET hobbies = ? WHERE email = ?`;
            await database.promise().query(sql, [hobbies, email]);
        } catch (error) {
            console.log('Error in updateHobbies function of UserController: ', error);
        }
    }

}

export default new UserController;