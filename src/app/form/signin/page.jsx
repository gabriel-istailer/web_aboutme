'use client'

import './page.css';
import '../layout.css';

import EmailVerification from '../../components/EmailVerification';

import Link from 'next/link';
import { useState } from 'react';

export default function signIn() {

    const [showPassword, setShowPassword] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [resendEmailVerificationButton, setResendEmailVerificationButton] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        email_code: ''
    });

    function changeShowPassword() {
        setShowPassword((prev) => !prev);
    }

    function disableResendEmailVerificationButton() {
        setResendEmailVerificationButton(false);
        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Espere 2 minutos para reenviar o email de verificação';
        buttonResendEmailVerification.classList.add('formLayout-button-simple-disabled');
        setTimeout(() => {
            setResendEmailVerificationButton((prev) => {
                if (!prev) {
                    buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
                    buttonResendEmailVerification.classList.remove('formLayout-button-simple-disabled');
                    return true;
                }
                return prev;
            });
            const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
            pMessageEmailVerification.textContent = 'Email de verificação expirado';
        }, 10 * 1000);
    }

    function resendEmailVerification() {
        if (resendEmailVerificationButton) {
            sendEmailVerification();
            disableResendEmailVerificationButton();
        } else {
            const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
            pMessageEmailVerification.textContent = 'Email de verificação já enviado, espere 2 minutos para reenviar.';
        }
    }

    async function sendEmailVerification() {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Enviando email de verificação...';
        try {
            const res = await fetch('/api/email-verifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: document.getElementById('inputEmail').value, isSignUp: false })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;

        } catch (error) {
            console.log('Erro no fetch para enviar o email de verificação: ', error);
            pMessageEmailVerification.textContent = 'Erro ao enviar email de verificação';
        }
    }

    function inputValidations() {
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        const pMessage = document.getElementById('pMessage');

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(inputEmail.value)) {
            pMessage.textContent = 'Email inválido';
            return false;
        }

        if (inputPassword.value.trim().length < 6 || inputPassword.value.trim().length > 16) {
            pMessage.textContent = 'A senha deve conter entre 6 à 16 caracteres';
            return false;
        } else if (inputPassword.value.includes(' ')) {
            pMessage.textContent = 'A senha não pode conter espaços';
            return false;
        }

        return true;
    }

    async function startEmailVerification() {
        if (!inputValidations()) {
            return;
        }

        sendEmailVerification();
        disableResendEmailVerificationButton();

        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        setFormData({
            email: inputEmail.value,
            password: inputPassword.value,
            email_code: ''
        });

        const spanUserEmail = document.getElementById('spanUserEmail');
        spanUserEmail.textContent = inputEmail.value;

        setDisplayEmailVerification(true);
    }

    async function cancelEmailVerification() {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Cancelando email de verificação...';
        try {
            const spanUserEmail = document.getElementById('spanUserEmail');
            const email = spanUserEmail.textContent;
            const res = await fetch('/api/email-verifications/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;
        } catch (error) {
            console.log('Erro no fetch para cancelar email de verificação');
        }

        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        inputEmail.value = '';
        inputPassword.value = '';
        setFormData({
            email: '',
            password: '',
            email_code: ''
        });

        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
        buttonResendEmailVerification.classList.remove('formLayout-button-simple-disabled');
        setResendEmailVerificationButton(true);

        setDisplayEmailVerification(false);
    }

    function finishForm() {

    }

    return (
        <div>

            <form className="formLayout-form flex-center flex-column" style={displayEmailVerification ? { display: 'none' } : { display: 'flex' }}>

                <h1 className="formLayout-title text-center">Entrar</h1>

                <label htmlFor="inputEmail" className="formLayout-label">Email:</label>
                <input type="email" className='formLayout-input' name="inputEmail" id="inputEmail" required />

                <label htmlFor="inputPassword " className="formLayout-label">Senha:</label>
                <input type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />
                <div className="formLayout-label-container-checkbox-show-password flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Mostrar senha:</label>
                </div>

                <button type="button" onClick={() => startEmailVerification()} className='formLayout-button'>Entrar</button>

                <Link className='formLayout-button-simple text-center' href='/form/signup'>Não tem uma conta cadastrada? Cadastre-se por aqui</Link>

                <p className="formLayout-message text-center" id='pMessage'></p>

            </form>

            <div style={displayEmailVerification ? { display: 'flex' } : { display: 'none' }}>
                <EmailVerification actions={{ finishForm, resendEmailVerification, cancelEmailVerification, buttonText: 'Entrar' }} />
            </div>

        </div>
    );
}