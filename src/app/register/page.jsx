'use client';

import './page.css'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Register() {

    const searchParams = useSearchParams();

    const [isRegistered, setIsRegistered] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
    const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        email_code: ''
    });

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

    }

    function startEmailVerification(isSignUp) {
        const inputNameSignUp = document.getElementById('inputNameSignUp');
        const inputEmailSignUp = document.getElementById('inputEmailSignUp');
        const inputPasswordSignUp = document.getElementById('inputPasswordSignUp');

        const pMessageSignUp = document.getElementById('pMessageSignUp');

        if (inputNameSignUp.value.trim().length < 3 || inputNameSignUp.value.trim().length > 50) {
            pMessageSignUp.textContent = 'O nome deve conter entre 3 à 50 caracteres';
            return;
        }

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(inputEmailSignUp.value)) {
            pMessageSignUp.textContent = 'Email inválido';
            return;
        }

        if (inputPasswordSignUp.value.trim().length < 6 || inputPasswordSignUp.value.trim().length > 16) {
            pMessageSignUp.textContent = 'A senha deve conter entre 6 à 16 caracteres';
            return;
        } else if (inputPasswordSignUp.value.includes(' ')) {
            pMessageSignUp.textContent = 'A senha não pode conter espaços';
            return;
        }

        setDisplayEmailVerification(true);
        setSignUpData({
            name: inputNameSignUp.value,
            email: inputEmailSignUp.value,
            password: inputPasswordSignUp.value,
            email_code: ''
        });
        const spanUserEmail = document.getElementById('spanUserEmail');
        spanUserEmail.textContent = inputEmailSignUp.value;
    }

    function cancelEmailVerification() {
        setDisplayEmailVerification(false);
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

                            <button type="button" className='button-form'>Entrar</button>

                            <button type="button" onClick={changeRegisteredStatus} className='button-simple'>Não tem uma conta cadastrada? Então cadastre-se por aqui.</button>

                            <p className="message-form" id='pMessageSignIn'></p>

                        </form>

                        <div className="form flex-center flex-column" style={displayEmailVerification ? {display: 'flex'} : {display: 'none'}}>

                            <h1 className="title-form">Verificação de Email</h1>

                            <p className="advice-form text-center">
                                Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Digite o código abaixo para verificarmos seu email.
                            </p>

                            <label htmlFor="inputEmailCodeSignUp" className="label-form">Código de verificação:</label>
                            <input type="number" className='input-form input-email-code-form text-center' min='0' max='999999' name="inputEmailCodeSignUp" id="inputEmailCodeSignUp" required />

                            <button type="button" className='button-form'>Cadastrar</button>

                            <button type="button" className='button-simple'>Reenviar código</button>

                            <button type='button' onClick={() => cancelEmailVerification()} className='button-simple'>Voltar para o cadastro</button>

                            <p className="message-form" id='pMessageEmailVerification'></p>

                        </div>

                    </div>
                </section>

            </header>

        </div>
    );
}