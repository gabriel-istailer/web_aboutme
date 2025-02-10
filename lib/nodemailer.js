import nodemailer from 'nodemailer';
import database from './database';
import { NextResponse } from 'next/server';

const emailTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSKEY
    }
});

const emailVerification = {
    createCode: function() {
        return Math.floor(100000 + Math.random() * 900000);
    },
    storageEmailCode: function(email, code) {
        const sql = `INSERT INTO ${process.env.DATABASE_EMAIL_CODE_TABLE} (email, code) VALUES (?, ?)`;
        database.query(sql, [email, code], (error) => {
            if(error) {
                NextResponse.json({error: 'Erro ao armazenar o email e o código de verificação'}, {status: 500});
            }
        });
    },
    deleteEmailCode: function(email) {
        const sql = `DELETE FROM ${process.env.DATABASE_EMAIL_CODE_TABLE} WHERE email = ?`
        database.query(sql, [email], (error) => {
            if(error) {
                NextResponse.json({error: 'Erro ao deletar o email e o código de verificação'}, {status: 500});
            }
        });
    },
    setExpirationTime: function(email) {
        setTimeout(() => {
            this.deleteEmailCode(email);
        }, 2 * 60 * 1000);
    },
    sendEmailSignUp: async function(email) {
        const code = this.createCode();
        const body = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `AboutMe | Código de verificação de email: ${code}`,
            text: `Olá, seu email está sendo cadastrado no AboutMe, escreva o código de verificação ${code} em nosso site para confirmar o cadastro. Se não for você que está se cadastrando em nosso site ignore este email.`
        };
        try {
            await emailTransport.sendMail(body);
            this.storageEmailCode(email, code);
            this.setExpirationTime(email);
        } catch (error) {
            NextResponse.json({error: 'Erro ao enviar o email de verificação'}, {status: 500});
        }
    },
    verifyCode: function(email, code) {
        
    }
};

export default emailVerification;