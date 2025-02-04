'use client';

import './page.css'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Register() {

    const searchParams = useSearchParams();

    const [isRegistered, setIsRegistered] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

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

    function changeShowPassword() {
        setShowPassword((prev) => !prev);
    }

    return (
        <div className="register">

            <header className="register-header">

                <nav className="register-header-nav flex-center">
                    <Link className="title font-LilyScriptOne" href='/'>AboutMe</Link>
                </nav>

                <section className="register-header-section flex-center">
                    <div className='background flex-v-center overflow-hidden'>

                        <form className="form signup flex-center flex-column" id='formSignUp'>

                            <div className="signup-stage-1 flex-center flex-column">

                                <h1 className="title title-signup text-center">Cadastro</h1>

                                <label htmlFor="nameInputSignUp" className='label'>Nome:</label>
                                <input type="text" className='input input-name-signup' name="name-input-signup" id="nameInputSignUp" maxLength={20} minLength={2} required />

                                <label htmlFor="emailInputSignUp" className='label'>Email:</label>
                                <input type="email" className='input input-email-signup' name="email-input-signup" id="emailInputSignUp" required />

                                <label htmlFor="passwordInputSignUp" className='label'>Senha:</label>
                                <input type={showPassword ? 'text' : 'password'} className='input input-password-signup' name="password-input-signup" id="passwordInputSignUp" required />

                                <div className="label-container-checkbox-signup flex-v-center">
                                    <input type="checkbox" checked={showPassword} onChange={changeShowPassword} className='checkbox-show-password-signup' name="checkbox-show-password-signup" id="showPasswordCheckboxSignUp" />
                                    <label htmlFor="showPasswordCheckboxSignUp" className='label-checkbox-signup'>Mostrar senha:</label>
                                </div>

                                <button type="button" className='button-signup'>Cadastrar</button>

                                <button type="button" onClick={changeRegisteredStatus} className='button-go-signin'>Já tem uma conta cadastrada? Então entre por aqui.</button>

                            </div>

                            <div className="signup-stage-2">

                                <h1 className="title-signup-stage-2">Verificação de Email</h1>


                            </div>

                        </form>

                        <form className="form signin flex-center flex-column">
                            <h1 className="title title-signin text-center">Entrar</h1>
                            <button type="button" onClick={changeRegisteredStatus}>Cadastrar</button>
                        </form>

                    </div>
                </section>

            </header>

        </div>
    );
}