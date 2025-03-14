export default function EmailVerification({ actions }) {

    return (
        <div className="formLayout-form flex-center flex-column">

                <h1 className="formLayout-title">Verificação de Email</h1>

                <p className="formLayout-advice text-center">
                    Enviamos um email com um código de verificação para <span id='spanUserEmail'></span>. Você tem 2 minutos para digitar o código abaixo para verificarmos seu email.
                </p>

                <label htmlFor="inputEmailVerificationCode" className="formLayout-label">Código de verificação:</label>
                <input type="number" className='formLayout-input formLayout-input-email-verification text-center' min='0' max='999999' name="inputEmailVerificationCode" id="inputEmailVerificationCode" required />

                <button type="button" className='formLayout-button' id='buttonFinishForm'>Entrar</button>

                <button type="button" onClick={actions.resendEmailVerification} className='formLayout-button-simple' id='buttonResendEmailVerification'>Reenviar email de verificação</button>

                <button type='button' onClick={actions.cancelEmailVerification} className='formLayout-button-simple'>Voltar para o formulário</button>

                <p className="formLayout-message" id='pMessageEmailVerification'></p>

        </div>
    );
}