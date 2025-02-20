'use client';

import './page.css'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Register() {

    const [isRegistered, setIsRegistered] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
    const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [resendEmailVerification, setResendEmailVerification] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        email_code: ''
    });
    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
        email_code: ''
    });

    const searchParams = useSearchParams();
    useEffect(() => {
        const registeredStatus = searchParams.get('isRegistered') === 'yes';
        setTimeout(() => {
            setIsFirstRender(false);
        }, 100);
        setIsRegistered(registeredStatus);
    }, [searchParams]);

    useEffect(() => {
        const formSignUp = document.getElementById('formSignUp');
        if (formSignUp) {
            formSignUp.style.transition = isFirstRender ? '0s' : '0.4s';
            formSignUp.style.marginLeft = isRegistered ? '-100%' : '0px';
        }
    }, [isRegistered, isFirstRender]);

    function changeRegisteredStatus() {
        setIsRegistered((prev) => !prev);
    }

    function changeShowPassword(isSignUp) {
        if(isSignUp) {
            setShowPasswordSignUp((prev) => !prev);
        } else {
            setShowPasswordSignIn((prev) => !prev);
        }  
    }

    function inputValidations(isSignUp) {
        let inputEmail = null;
        let inputPassword = null;
        let pMessage = null;
        if(isSignUp) {
            const inputNameSignUp = document.getElementById('inputNameSignUp');
            inputEmail = document.getElementById('inputEmailSignUp');
            inputPassword = document.getElementById('inputPasswordSignUp');
            pMessage = document.getElementById('pMessageSignUp');
            if (inputNameSignUp.value.trim().length < 3 || inputNameSignUp.value.trim().length > 50) {
                pMessage.textContent = 'O nome deve conter entre 3 à 50 caracteres';
                return false;
            }
        } else {
            inputEmail = document.getElementById('inputEmailSignIn');
            inputPassword = document.getElementById('inputPasswordSignIn');
            pMessage = document.getElementById('pMessageSignIn');
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

    function noResendEmailVerification() {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Email de verificação já enviado, espere 2 minutos para reenviar.';
    }

    async function sendEmailVerification(isSignUp) {
        let inputEmail = null;
        if(isSignUp) {
            inputEmail = document.getElementById('inputEmailSignUp');
        } else {
            inputEmail = document.getElementById('inputEmailSignIn');
        }
        
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        try {
            const res = await fetch('/api/send-email-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: inputEmail.value, isSignUp: isSignUp})
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;

        } catch(error) {
            console.log('Erro no fetch para enviar o email de verificação: ', error);
            pMessageEmailVerification.textContent = 'Erro ao enviar email de verificação';
        }
    }

    function startEmailVerification(isSignUp) {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Enviando email de verificação...';
        sendEmailVerification(isSignUp);
        let inputEmail = null;
        const buttonFinishForm = document.getElementById('buttonFinishForm');
        if(isSignUp) {
            if(!inputValidations(true)) {
                return;
            }
            const inputNameSignUp = document.getElementById('inputNameSignUp');
            inputEmail = document.getElementById('inputEmailSignUp');
            const inputPasswordSignUp = document.getElementById('inputPasswordSignUp');
            setSignUpData({
                name: inputNameSignUp.value,
                email: inputEmail.value,
                password: inputPasswordSignUp.value,
                email_code: ''
            });
            buttonFinishForm.textContent = 'Cadastrar';
        } else {
            if(!inputValidations(false)) {
                return;
            }
            inputEmail = document.getElementById('inputEmailSignIn');
            const inputPasswordSignIn = document.getElementById('inputPasswordSignIn');
            setSignInData({
                email: inputEmail.value,
                password: inputPasswordSignIn.value,
                email_code: ''
            });
            buttonFinishForm.textContent = 'Entrar';
        }

        setResendEmailVerification(false);
        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Espere 2 minutos para reenviar o email de verificação';
        buttonResendEmailVerification.classList.add('button-simple-disabled');
        setTimeout(() => {
            setResendEmailVerification((prev) => {
                if(!prev) {
                    buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
                    buttonResendEmailVerification.classList.remove('button-simple-disabled');
                    return true;
                }
                return prev;
            });
        }, 15 * 1000);

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
                body: JSON.stringify({email: email})
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;
        } catch (error) {
            console.log('Erro no fetch para cancelar email de verificação');
        }

        let isSignUp = true;
        const buttonFinishForm = document.getElementById('buttonFinishForm');
        if(buttonFinishForm.textContent === 'Entrar') {
            isSignUp = false;
        }

        if(isSignUp) {
            const inputNameSignUp = document.getElementById('inputNameSignUp');
            const inputEmailSignUp = document.getElementById('inputEmailSignUp');
            const inputPasswordSignUp = document.getElementById('inputPasswordSignUp');
            inputNameSignUp.value = '';
            inputEmailSignUp.value = '';
            inputPasswordSignUp.value = '';
            setSignUpData({
                name: '',
                email: '',
                password: '',
                email_code: ''
            });
        } else {
            const inputEmailSignIn = document.getElementById('inputEmailSignIn');
            const inputPasswordSignIn = document.getElementById('inputPasswordSignIn');
            inputEmailSignIn.value = '';
            inputPasswordSignIn.value = '';
            setSignInData({
                email: '',
                password: '',
                email_code: ''
            });
        }

        buttonFinishForm.textContent = '';

        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
        buttonResendEmailVerification.classList.remove('button-simple-disabled');
        setResendEmailVerification(true);

        setDisplayEmailVerification(false);
    }

    return (
        <div className="register">

            <header className="register-header">

                <nav className="register-header-nav flex-center">
                    <Link className="title font-LilyScriptOne" href='/'>AboutMe</Link>
                </nav>

                <section className="register-header-section flex-center">
                    <div className='background flex-v-center overflow-hidden'>

                        <form className="form flex-center flex-column" id='formSignUp' style={displayEmailVerification ? {display: 'none'} : {display: 'flex'}}>

                            <h1 className="title-form text-center">Cadastro</h1>

                            <label htmlFor="nameInputSignUp" className='label-form'>Nome:</label>
                            <input type="text" className='input-form' name="inputNameSignUp" id="inputNameSignUp" maxLength={50} minLength={3} required />

                            <label htmlFor="emailInputSignUp" className='label-form'>Email:</label>
                            <input type="email" className='input-form' name="inputEmailSignUp" id="inputEmailSignUp" required />

                            <label htmlFor="inputPasswordSignUp" className='label-form'>Senha:</label>
                            <input type={showPasswordSignUp ? 'text' : 'password'} className='input-form' name="inputPasswordSignUp" id="inputPasswordSignUp" required />

                            <div className="label-container-checkbox-form flex-v-center">
                                <input type="checkbox" checked={showPasswordSignUp} onChange={() => changeShowPassword(true)} className='checkbox-show-password-form' name="showPasswordCheckboxSignUp" id="showPasswordCheckboxSignUp" />
                                <label htmlFor="showPasswordCheckboxSignUp" className='label-checkbox-form'>Mostrar senha:</label>
                            </div>

                            <button type="button" onClick={() => startEmailVerification(true)} className='button-form'>Cadastrar</button>

                            <button type="button" onClick={changeRegisteredStatus} className='button-simple'>Já tem uma conta cadastrada? Então entre por aqui.</button>

                            <p className="message-form text-center" id='pMessageSignUp'></p>

                        </form>

                        <form className="form flex-center flex-column" style={displayEmailVerification ? {display: 'none'} : {display: 'flex'}}>

                            <h1 className="title-form">Entrar</h1>

                            <label htmlFor="inputEmailSignIn" className="label-form">Email:</label>
                            <input type="email" className='input-form' name="inputEmailSignIn" id="inputEmailSignIn" required />

                            <label htmlFor="inputPasswordSignIn" className="label-form">Senha:</label>
                            <input type={showPasswordSignIn ? 'text' : 'password'} className='input-form' name="inputPasswordSignIn" id="inputPasswordSignIn" required />
                            <div className="label-container-checkbox-form flex-v-center">
                                <input type="checkbox" checked={showPasswordSignIn} onChange={() => changeShowPassword(false)} className='checkbox-show-password-form' name="showPasswordCheckboxSignIn" id="showPasswordCheckboxSignIn" />
                                <label htmlFor="showPasswordCheckboxSignIn" className='label-checkbox-form'>Mostrar senha:</label>
                            </div>

                            <button type="button" onClick={() => startEmailVerification(false)} className='button-form'>Entrar</button>

                            <button type="button" onClick={changeRegisteredStatus} className='button-simple'>Não tem uma conta cadastrada? Então cadastre-se por aqui.</button>

                            <p className="message-form" id='pMessageSignIn'></p>

                        </form>

                        <div className="form flex-center flex-column" style={displayEmailVerification ? {display: 'flex'} : {display: 'none'}}>

                            <h1 className="title-form">Verificação de Email</h1>

                            <p className="advice-form text-center">
                                Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Você tem 2 minutos para digitar o código abaixo para verificarmos seu email.
                            </p>

                            <label htmlFor="inputEmailCodeSignUp" className="label-form">Código de verificação:</label>
                            <input type="number" className='input-form input-email-code-form text-center' min='0' max='999999' name="inputEmailCodeSignUp" id="inputEmailCodeSignUp" required />

                            <button type="button" className='button-form' id='buttonFinishForm'></button>

                            <button type="button" onClick={resendEmailVerification ? sendEmailVerification : noResendEmailVerification} className='button-simple' id='buttonResendEmailVerification'>Reenviar email de verificação</button>

                            <button type='button' onClick={cancelEmailVerification} className='button-simple'>Voltar para o formulário</button>

                            <p className="message-form" id='pMessageEmailVerification'></p>

                        </div>

                    </div>
                </section>

            </header>

        </div>
    );
}