import nodemailer from 'nodemailer';

export default emailTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APPKEY
    }
});