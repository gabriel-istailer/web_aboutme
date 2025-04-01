import emailTransport from "../middlewares/nodemailer";
import database from "../database/database";

let timeout = null;
class EmailVerificationController {

    createCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    async verifyCode(email, code) {
        try {
            code = parseInt(code);
            const sql = `SELECT * FROM ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            return (results.length > 0) && (results[0].code === code);
        } catch(error) {
            console.log('Error checking verification code in database: ', error);
        }
    }

    storageEmailCode(email, code) {
        try {
            code = parseInt(code);
            const sql = `INSERT INTO ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} (email, code) VALUES (?, ?)`;
            database.query(sql, [email, code]);
        } catch(error) {
            console.log('Error storing email and verification code in database: ', error);
        }
    }

    deleteEmailCode(email) {
        try {
            const sql = `DELETE FROM ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} WHERE email = ?`
            database.query(sql, [email]);
            clearTimeout(timeout);
        } catch(error) {
            console.log('Error deleting email and verification code from database: ', error);
        }
    }

    setExpirationTime(email) {
        timeout = setTimeout(() => {
            this.deleteEmailCode(email);
        }, 2 * 60 * 1000);
    }

    async sendEmail(email, isSingUp) {
        const code = this.createCode();
        const body = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `AboutMe | Email verification code: ${code}`,
            text: isSingUp
            ? `Hello, your email is being registered on AboutMe, write the verification code ${code} on our website to confirm your registration. If you are not the one registering on our website, please ignore this email.`
            : `Hello, your AboutMe account is being accessed, please enter the verification code ${code} on our website to confirm access. If you are not the one accessing the account on our website, please ignore this email.`
        };

        try {
            await emailTransport.sendMail(body);
            this.storageEmailCode(email, code);
            this.setExpirationTime(email);
        } catch(error) {
            console.log('Error sending verification email to user: ', error);
        }
    }
}

export default new EmailVerificationController;