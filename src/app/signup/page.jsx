'use client'

import '@/layouts/formLayout.css';

import formLayout from "@/layouts/formLayout"

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

    

    return (
        <formLayout>
            <form className="formLayout-form flex-center flex-column" id='formSignUp' style={displayEmailVerification ? { display: 'none' } : { display: 'flex' }}>

                <h1 className="formLayout-title text-center">Cadastro</h1>

                <label htmlFor="nameInputSignUp" className='formLayout-label'>Nome:</label>
                <input type="text" className='formLayout-input' name="inputNameSignUp" id="inputNameSignUp" maxLength={50} minLength={3} required />

                <label htmlFor="emailInputSignUp" className='formLayout-label'>Email:</label>
                <input type="email" className='formLayout-input' name="inputEmailSignUp" id="inputEmailSignUp" required />

                <label htmlFor="inputPasswordSignUp" className='formLayout-label-'>Senha:</label>
                <input type={showPasswordSignUp ? 'text' : 'password'} className='formLayout-input' name="inputPasswordSignUp" id="inputPasswordSignUp" required />

                <div className="formLayout-label-container-checkbox-show-password flex-v-center">
                    <input type="checkbox" checked={showPasswordSignUp} onChange={() => changeShowPassword(true)} className='formLayout-checkbox-show-password' name="showPasswordCheckboxSignUp" id="showPasswordCheckboxSignUp" />
                    <label htmlFor="showPasswordCheckboxSignUp" className='formLayout-label-checkbox-show-password'>Mostrar senha:</label>
                </div>

                <button type="button" onClick={() => { setIsSignUp(true); setTimeout(() => { startEmailVerification() }, 100) }} className='formLayout-button'>Cadastrar</button>

                <button type="button" onClick={changeRegisteredStatus} className='formLayout-button-simple'>Já tem uma conta cadastrada? Então entre por aqui.</button>

                <p className="formLayout-message text-center" id='pMessageSignUp'></p>

            </form>

            <div className="formLayout-form flex-center flex-column" style={displayEmailVerification ? { display: 'flex' } : { display: 'none' }}>

                <h1 className="formLayout-title">Verificação de Email</h1>

                <p className="formLayout-advice text-center">
                    Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Você tem 2 minutos para digitar o código abaixo para verificarmos seu email.
                </p>

                <label htmlFor="inputEmailCodeSignUp" className="formLayout-label">Código de verificação:</label>
                <input type="number" className='formLayout-input formLayout-input-email-verification text-center' min='0' max='999999' name="inputEmailCodeSignUp" id="inputEmailCodeSignUp" required />

                <button type="button" className='formLayout-button' id='buttonFinishForm'></button>

                <button type="button" onClick={resendEmailVerification} className='formLayout-button-simple' id='buttonResendEmailVerification'>Reenviar email de verificação</button>

                <button type='button' onClick={cancelEmailVerification} className='formLayout-button-simple'>Voltar para o formulário</button>

                <p className="formLayout-message" id='pMessageEmailVerification'></p>

            </div>
        </formLayout>
    );
}