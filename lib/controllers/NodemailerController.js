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
                subject: 'AboutMe | Email Validation ',
                text: `Click on the following link to validate your email and complete your registration on our website: ${validationLink}`
            };

            await emailTransport.sendMail(body);
        } catch (error) {
            console.log('Error in the sendEmailVerification function of the NodemailerController:', error);
        }
    }
    async sendPasswordRecovery(token, email) {
        try {
            const recoveryLink = `http://localhost:3000/form/signin/recovery-password/finish?token=${token}`;

            const body = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'AboutMe | Recovery Password',
                text: `Click on the following link to recover your password on our website: ${recoveryLink}`
            }

            await emailTransport.sendMail(body);

        } catch (error) {
            console.log('Error in the sendPasswordRecovery function of the NodemailerController: ', error);
        }
    }
}

export default new NodemailerController;