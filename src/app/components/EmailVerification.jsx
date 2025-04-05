'use client';

import { useState, useEffect } from "react";

let timeout = null;
export default function EmailVerification({ actions }) {

    const [loading, setLoading] = useState(false);
    const [resendEmailVerification, setResendEmailVerification] = useState(false);

    function notResendEmailVerification() {
        document.getElementById('pMessageEmailVerification').textContent = 'Wait 2 minutes for the verification email to be resent';
    }

    function disableResendEmailVerification() {
        setLoading(true);
        setResendEmailVerification(false);
        timeout = setTimeout(() => {
            setResendEmailVerification(true);
            document.getElementById('pMessageEmailVerification').textContent = 'Verification email expired';
        }, 2 * 60 * 1000);
        setLoading(false);
    }

    async function sendEmailVerification(email) {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Sending verification email...';
        disableResendEmailVerification();

        setLoading(true);

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
            console.log('Error fetching to send verification email:', error);
            pMessageEmailVerification.textContent = 'Error sending verification email';
        }

        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        actions.setSendEmailVerification(() => (email) => sendEmailVerification(email));
        setLoading(false);
    }, [actions.setSendEmailVerification]);

    async function cancelEmailVerification() {
        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        pMessageEmailVerification.textContent = 'Canceling verification email...';

        setLoading(true);

        const spanUserEmail = document.getElementById('spanUserEmail');
        const email = spanUserEmail.textContent;
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
            console.log('Error fetching to cancel verification email');
        }
        spanUserEmail.textContent = '';
        document.getElementById('inputEmailVerificationCode').value = '';

        clearTimeout(timeout);
        actions.restartForm();
        setLoading(false);
    }

    return (
        <div className="formLayout-form flex-center flex-column">

            <h1 className="formLayout-title">Email Verification</h1>

            <p className="formLayout-advice text-center">
                We've sent an email with a verification code to <span id="spanUserEmail"></span>. 
                You have 2 minutes to enter the code below and we'll verify your email.
            </p>

            <label htmlFor="inputEmailVerificationCode" className="formLayout-label">Verification code:</label>
            <input type="number" className='formLayout-input formLayout-input-email-verification text-center' min='0' max='999999' name="inputEmailVerificationCode" id="inputEmailVerificationCode" required />

            <button type="button" onClick={() => {actions.finishForm(); setLoading(true);}} className='formLayout-button' id='buttonFinishForm'>{actions.isSignUp ? 'Sign Up' : 'Sign In'}</button>

            <button
                type="button"
                onClick={resendEmailVerification ? () => sendEmailVerification(document.getElementById('spanUserEmail').textContent) : notResendEmailVerification}
                className={resendEmailVerification ? 'formLayout-button-simple' : 'formLayout-button-simple formLayout-button-simple-disabled'}
                id='buttonResendEmailVerification'
            >
                Resend verification email
            </button>

            <button type='button' onClick={cancelEmailVerification} className='formLayout-button-simple'>Back to form</button>

            <p className="formLayout-message" id='pMessageEmailVerification'></p>

            <p className='formLayout-loading text-center flex-center' style={loading ? {display: 'flex'} : {display: 'none'}}>Loading...</p>

        </div>
    );
}