import emailTransport from "../middlewares/nodemailer";
const jwt = require('jsonwebtoken');

class NodemailerController {
    async sendEmailVerification(user) {
        try {
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2m' });

            const validationLink = `http://localhost:3000/form/signup/finish?token=${token}`;

            const body = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'AboutMe | Verificação de Email',
                text: `Clique no link à seguir para validar seu email e finalizar seu cadastro em nosso site: ${validationLink}`
            };

            await emailTransport.sendMail(body);
        } catch (error) {
            console.log('Error in the sendEmailVerification function of the NodemailerController:', error);
        }
    }
}

export default new NodemailerController;