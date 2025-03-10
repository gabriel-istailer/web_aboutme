export default function signIn() {


    const [isRegistered, setIsRegistered] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
    const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [resendEmailVerificationButton, setResendEmailVerificationButton] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
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
        if (isSignUp) {
            setShowPasswordSignUp((prev) => !prev);
        } else {
            setShowPasswordSignIn((prev) => !prev);
        }
    }

    function disableResendEmailVerificationButton() {
        setResendEmailVerificationButton(false);
        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Espere 2 minutos para reenviar o email de verificação';
        buttonResendEmailVerification.classList.add('button-simple-disabled');
        setTimeout(() => {
            setResendEmailVerificationButton((prev) => {
                if (!prev) {
                    buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
                    buttonResendEmailVerification.classList.remove('button-simple-disabled');
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
        let inputEmail = null;
        if (isSignUp) {
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
                body: JSON.stringify({ email: inputEmail.value, isSignUp: isSignUp })
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;

        } catch (error) {
            console.log('Erro no fetch para enviar o email de verificação: ', error);
            pMessageEmailVerification.textContent = 'Erro ao enviar email de verificação';
        }
    }

    function inputValidations() {
        let inputEmail = null;
        let inputPassword = null;
        let pMessage = null;
        if (isSignUp) {
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

    async function startEmailVerification() {
        let pMessage = null;
        if (isSignUp) {
            if (!inputValidations()) {
                return;
            }
            pMessage = document.getElementById('pMessageSignUp');
            try {
                const res = await fetch('/api/verify-user-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: document.getElementById('inputEmailSignUp').value })
                });
                const resData = await res.json();
                if (resData.isRegistered) {
                    pMessage.textContent = 'Este email já está cadastrado';
                    return;
                }
            } catch (error) {
                console.log('Erro no fetch de verificar se o email está já está cadastrado: ', error);
            }
        } else {
            if (!inputValidations()) {
                return;
            }
            pMessage = document.getElementById('pMessageSignIn');
        }

        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Enviando email de verificação...';
        sendEmailVerification();
        disableResendEmailVerificationButton();

        let inputEmail = null;
        const buttonFinishForm = document.getElementById('buttonFinishForm');
        if (isSignUp) {
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
            inputEmail = document.getElementById('inputEmailSignIn');
            const inputPasswordSignIn = document.getElementById('inputPasswordSignIn');
            setSignInData({
                email: inputEmail.value,
                password: inputPasswordSignIn.value,
                email_code: ''
            });
            buttonFinishForm.textContent = 'Entrar';
        }

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

        if (isSignUp) {
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

        const buttonFinishForm = document.getElementById('buttonFinishForm');
        buttonFinishForm.textContent = '';

        const buttonResendEmailVerification = document.getElementById('buttonResendEmailVerification');
        buttonResendEmailVerification.textContent = 'Reenviar email de verificação';
        buttonResendEmailVerification.classList.remove('button-simple-disabled');
        setResendEmailVerificationButton(true);

        setDisplayEmailVerification(false);
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

                <button type="button" className='formLayout-button'>Entrar</button>

                <button type="button" onClick={changeRegisteredStatus} className='button-simple'>Não tem uma conta cadastrada? Então cadastre-se por aqui.</button>

                <p className="message-form" id='pMessageSignIn'></p>

            </form>

            <div className="formLayout-form flex-center flex-column" style={displayEmailVerification ? { display: 'flex' } : { display: 'none' }}>

                <h1 className="formLayout-title">Verificação de Email</h1>

                <p className="formLayout-advice text-center">
                    Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Você tem 2 minutos para digitar o código abaixo para verificarmos seu email.
                </p>

                <label htmlFor="inputEmailVerificationCode" className="formLayout-label">Código de verificação:</label>
                <input type="number" className='formLayout-input formLayout-input-email-verification text-center' min='0' max='999999' name="inputEmailVerificationCode" id="inputEmailVerificationCode" required />

                <button type="button" className='formLayout-button' id='buttonFinishForm'>Entrar</button>

                <button type="button" onClick={resendEmailVerification} className='formLayout-button-simple' id='buttonResendEmailVerification'>Reenviar email de verificação</button>

                <button type='button' onClick={cancelEmailVerification} className='formLayout-button-simple'>Voltar para o formulário</button>

                <p className="formLayout-message" id='pMessageEmailVerification'></p>

            </div>

        </div>
    );
}