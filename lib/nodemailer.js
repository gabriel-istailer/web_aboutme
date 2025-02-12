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
    verifyEmail: function(email) {
        try {
            const sql = `SELECT * FROM ${process.env.DATABASE_EMAIL_CODE_TABLE} WHERE email = ?`;
            const [results] = database.query(sql, [email]);
            return results.length > 0;
        } catch (error) {
            console.log('Erro ao verificar email no banco de dados: ', error);
            return NextResponse.json({error: 'Erro ao verificar email no banco de dados'}, {status: 500});
        }
    },
    verifyCode: function(email, code) {
        try {
            code = parseInt(code);
            const sql = `SELECT * FROM ${process.env.DATABASE_EMAIL_CODE_TABLE} WHERE email = ?`;
            const [results] = database.query(sql, [email]);
            return results.length > 0 && results[0].code === code;
        } catch (error) {
            console.log('Erro ao verificar código de verificação no banco de dados: ', error);
            return NextResponse.json({error: 'Erro ao verificar código de verificação no banco de dados'}, {status: 500});   
        }
    },
    storageEmailCode: function(email, code) {
        const sql = `INSERT INTO ${process.env.DATABASE_EMAIL_CODE_TABLE} (email, code) VALUES (?, ?)`;
        database.query(sql, [email, code], (error) => {
            if(error) {
                console.log('Erro ao armazenar o email e o código de verificação no banco de dados: ', error);
                return NextResponse.json({error: 'Erro ao armazenar o email e o código de verificação no banco de dados'}, {status: 500});
            }
            return NextResponse.json({message: 'Email e código de verificação armazenados no banco de dados'}, {status: 201});
        });
    },
    deleteEmailCode: function(email) {
        const sql = `DELETE FROM ${process.env.DATABASE_EMAIL_CODE_TABLE} WHERE email = ?`
        database.query(sql, [email], (error) => {
            if(error) {
                console.log('Erro ao deletar o email e o código de verificação do banco de dados: ', error);
                return NextResponse.json({error: 'Erro ao deletar o email e o código de verificação do banco de dados'}, {status: 500});
            }
            return NextResponse.json({message: 'Email e código de verificação deletados do banco de dados'}, {status: 200});
        });
    },
    setExpirationTime: function(email) {
        setTimeout(() => {
            if(this.verifyEmail(email)) {
                this.deleteEmailCode(email);
                return NextResponse.json({message: 'Tempo de verificar email expirado, email e código de verificação deletados do banco de dados'}, {status: 200});
            } else {
                return NextResponse.json({message: 'Tempo de verificar email expirado, email já verificado'}, {status: 200});
            }
        }, 2 * 60 * 1000);
    },
    sendEmail: async function(email, isSingUp) {
        const code = this.createCode();
        const body = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `AboutMe | Código de verificação de email: ${code}`,
            text: isSingUp ? 
            `Olá, seu email está sendo cadastrado no AboutMe, escreva o código de verificação ${code} em nosso site para confirmar o cadastro. Se não for você que está se cadastrando em nosso site ignore este email.`
            :
            `Olá, sua conta do AboutMe está sendo acessada, escreva o código de verificação ${code} em nosso site para confirmar o acesso. Se não for você que está acessando a conta em nosso site ignore este email.`
        };
        try {
            await emailTransport.sendMail(body);
            this.storageEmailCode(email, code);
            this.setExpirationTime(email);
        } catch (error) {
            console.log('Erro ao enviar o email de verificação para o usuário: ', error);
            return NextResponse.json({error: 'Erro ao enviar o email de verificação para o usuário'}, {status: 500});
        }
    }
};

export default emailVerification;