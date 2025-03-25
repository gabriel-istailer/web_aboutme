'use client'

import { useState, useEffect } from "react";

let timeout = null;
let email = null;
export default function EmailVerification({ actions }) {

    const [resendEmailVerification, setResendEmailVerification] = useState(false);

    function notResendEmailVerification() {
        document.getElementById('pMessageEmailVerification').textContent = 'Espere 2 minutos para reenviar o email de verificação';
    }

    function disableResendEmailVerification() {
        setResendEmailVerification(false);
        timeout = setTimeout(() => {
            setResendEmailVerification(true);
            document.getElementById('pMessageEmailVerification').textContent = 'Email de verificação expirado';
        }, 2 * 60 * 1000);
    }

    async function sendEmailVerification(email) {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Enviando email de verificação...';
        disableResendEmailVerification();
        try {
            const res = await fetch('/api/email-verifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, isSignUp: actions.isSignUp })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;

        } catch (error) {
            console.log('Erro no fetch para enviar o email de verificação: ', error);
            pMessageEmailVerification.textContent = 'Erro ao enviar email de verificação';
        }
    }

    useEffect(() => {
        actions.setSendEmailVerification(() => (email) => sendEmailVerification(email));
    }, [actions.setSendEmailVerification]);

    async function cancelEmailVerification() {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Cancelando email de verificação...';
        const spanUserEmail = document.getElementById('spanUserEmail');
        const email = spanUserEmail.textContent;
        spanUserEmail.textContent = '';
        try {
            const res = await fetch('/api/email-verifications/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;
        } catch (error) {
            console.log('Erro no fetch para cancelar email de verificação');
        }
        clearTimeout(timeout);
        actions.restartForm();
    }

    return (
        <div className="formLayout-form flex-center flex-column">

            <h1 className="formLayout-title">Verificação de Email</h1>

            <p className="formLayout-advice text-center">
                Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Você tem 2 minutos para digitar o código abaixo para verificarmos seu email.
            </p>

            <label htmlFor="inputEmailVerificationCode" className="formLayout-label">Código de verificação:</label>
            <input type="number" className='formLayout-input formLayout-input-email-verification text-center' min='0' max='999999' name="inputEmailVerificationCode" id="inputEmailVerificationCode" required />

            <button type="button" onClick={actions.finishForm} className='formLayout-button' id='buttonFinishForm'>{actions.isSignUp ? 'Cadastrar' : 'Entrar'}</button>

            <button
                type="button"
                onClick={resendEmailVerification ? () => sendEmailVerification(document.getElementById('spanUserEmail').textContent) : notResendEmailVerification}
                className={resendEmailVerification ? 'formLayout-button-simple' : 'formLayout-button-simple formLayout-button-simple-disabled'}
                id='buttonResendEmailVerification'
            >
                {resendEmailVerification ? 'Reenviar email de verificação' : 'Espere 2 minutos para reenviar o email de verificação'}
            </button>

            <button type='button' onClick={cancelEmailVerification} className='formLayout-button-simple'>Voltar para o formulário</button>

            <p className="formLayout-message" id='pMessageEmailVerification'></p>

        </div>
    );
}