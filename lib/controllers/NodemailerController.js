import emailTransport from "../middlewares/nodemailer";
const jwt = require('jsonwebtoken');

class NodemailerController {
    async sendEmailVerificationToUpdate(emails) {
        try {
            const token = jwt.sign(emails, process.env.JWT_SECRET, { expiresIn: '2m' });

            const validationLink = `http://localhost:3000/account/update/email/finish?token=${token}`;

            const body = {
                from: process.env.EMAIL_USER,
                to: emails.newEmail,
                subject: 'AboutMe | Email Validation',
                text: `Click the following link to validate the email exchange on our website: ${validationLink}`
            };

            await emailTransport.sendMail(body);
        } catch (error) {
            console.log('Error in the sendEmailVerificationToUpdate function of the NodemailerController: ', error);
        }
    }
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
    async sendPasswordRecovery(email) {
        try {
            const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '2m' });
            
            const recoveryLink = `http://localhost:3000/form/signin/recovery-password?token=${token}`;

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