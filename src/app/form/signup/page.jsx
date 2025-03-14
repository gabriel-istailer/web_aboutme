'use client'

import './page.css';
import '../layout.css';

import EmailVerification from '../../components/EmailVerification';

import Link from 'next/link';
import { useState } from 'react';

export default function signUp() {

    const [showPassword, setShowPassword] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [resendEmailVerificationButton, setResendEmailVerificationButton] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        email_verification_code: ''
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
            const res = await fetch('/api/send-email-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: document.getElementById('inputEmail').value, isSignUp: true })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;

        } catch (error) {
            console.log('Erro no fetch para enviar o email de verificação: ', error);
            pMessageEmailVerification.textContent = 'Erro ao enviar email de verificação';
        }
    }

    function inputValidations() {
        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        const pMessage = document.getElementById('pMessage');

        if (inputName.value.trim().length < 3 || inputName.value.trim().length > 50) {
            pMessage.textContent = 'O nome deve conter entre 3 à 50 caracteres';
            return false;
        }

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
        const pMessage = document.getElementById('pMessage');
        try {
            const res = await fetch('/api/verify-user-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: document.getElementById('inputEmail').value })
            });
            const resData = await res.json();
            if (resData.isRegistered) {
                pMessage.textContent = 'Este email já está cadastrado';
                return;
            }
        } catch (error) {
            console.log('Erro no fetch de verificar se o email está já está cadastrado: ', error);
        }

        sendEmailVerification();
        disableResendEmailVerificationButton();

        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        setFormData({
            name: inputName.value,
            email: inputEmail.value,
            password: inputPassword.value,
            email_verification_code: ''
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
            const res = await fetch('/api/cancel-email-verification', {
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

        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        inputName.value = '';
        inputEmail.value = '';
        inputPassword.value = '';
        setFormData({
            name: '',
            email: '',
            password: '',
            email_verification_code: ''
        });

        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
        buttonResendEmailVerification.classList.remove('formLayout-button-simple-disabled');
        setResendEmailVerificationButton(true);

        setDisplayEmailVerification(false);
    }

    return (
        <div>
            <form className="formLayout-form flex-center flex-column" id='formSignUp' style={displayEmailVerification ? { display: 'none' } : { display: 'flex' }}>

                <h1 className="formLayout-title text-center">Cadastro</h1>

                <label htmlFor="inputName" className='formLayout-label'>Nome:</label>
                <input type="text" className='formLayout-input' name="inputName" id="inputName" maxLength={50} minLength={3} required />

                <label htmlFor="inputEmail" className='formLayout-label'>Email:</label>
                <input type="email" className='formLayout-input' name="inputEmail" id="inputEmail" required />

                <label htmlFor="inputPassword" className='formLayout-label'>Senha:</label>
                <input type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />

                <div className="formLayout-label-container-checkbox-show-password flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Mostrar senha:</label>
                </div>

                <button type="button" onClick={() => startEmailVerification()} className='formLayout-button'>Cadastrar</button>

                <Link className='formLayout-button-simple text-center' href='/form/signin'>Já tem uma conta cadastrada? Então entre por aqui.</Link>

                <p className="formLayout-message text-center" id='pMessage'></p>

            </form>

            <div style={displayEmailVerification ? { display: 'flex' } : { display: 'none' }}>
                <EmailVerification actions={{ resendEmailVerification, cancelEmailVerification }}/>
            </div>

        </div>
    );
}