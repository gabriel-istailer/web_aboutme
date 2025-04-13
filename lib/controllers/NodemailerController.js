import emailTransport from "../middlewares/nodemailer";
const jwt = require('jsonwebtoken');

class Nodemailer {
    async sendEmailVerification(user) {

        const token = jwt.sign({}, process.env.JWT_SECRET);

        const validationLink = `http://localhost:3000/api/users/signup/finish?token=${token}`;

        const body = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'AboutMe | Verificação de Email',
            text: `Clique no link à seguir para validar seu email e finalizar seu cadastro em nosso site:`
        };
    }
}

export default new Nodemailer;