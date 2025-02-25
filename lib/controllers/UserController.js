import database from "../database/database";

class UserController {
    
    async verifyUser(email) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_USERS_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            return (results.length > 0);
        } catch(error) {
            console.log('Erro na função verifyUser do UserController:', error);
        }
    }
    
}

export default new UserController;