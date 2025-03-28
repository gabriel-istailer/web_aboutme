import emailTransport from "../middlewares/nodemailer";
import database from "../database/database";

let timeout = null;
class EmailVerificationController {

    createCode() {
        console.log('Código de verificação criado');
        return Math.floor(100000 + Math.random() * 900000);
    }

    async verifyCode(email, code) {
        try {
            code = parseInt(code);
            const sql = `SELECT * FROM ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} WHERE email = ?`;
            const [results] = await database.promise().query(sql, [email]);
            return (results.length > 0) && (results[0].code === code);
        } catch(error) {
            console.log('Erro ao verificar código de verificação no banco de dados: ', error);
        }
    }

    storageEmailCode(email, code) {
        try {
            code = parseInt(code);
            const sql = `INSERT INTO ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} (email, code) VALUES (?, ?)`;
            database.query(sql, [email, code]);
        } catch(error) {
            console.log('Erro ao armazenar o email e o código de verificação no banco de dados: ', error);
        }
    }

    deleteEmailCode(email) {
        try {
            const sql = `DELETE FROM ${process.env.DATABASE_EMAIL_VERIFICATION_TABLE} WHERE email = ?`
            database.query(sql, [email]);
            clearTimeout(timeout);
        } catch(error) {
            console.log('Erro ao deletar o email e o código de verificação do banco de dados: ', error);
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
            subject: `AboutMe | Código de verificação de email: ${code}`,
            text: isSingUp
            ? `Olá, seu email está sendo cadastrado no AboutMe, escreva o código de verificação ${code} em nosso site para confirmar o cadastro. Se não for você que está se cadastrando em nosso site ignore este email.`
            : `Olá, sua conta do AboutMe está sendo acessada, escreva o código de verificação ${code} em nosso site para confirmar o acesso. Se não for você que está acessando a conta em nosso site ignore este email.`
        };

        try {
            await emailTransport.sendMail(body);
            this.storageEmailCode(email, code);
            this.setExpirationTime(email);
        } catch(error) {
            console.log('Erro ao enviar o email de verificação para o usuário: ', error);
        }
    }
}

export default new EmailVerificationController;