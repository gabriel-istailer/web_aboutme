import nodemailer from 'nodemailer';
import database from './database';

const emailTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSKEY
    }
});

const emailObject = {
    createCode: function() {
        
    },
};
emailObject.sendEmail();

export default emailObject;