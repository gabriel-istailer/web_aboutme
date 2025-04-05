'use client';

import './page.css';
import '../layout.css';

import EmailVerification from '../../components/EmailVerification';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function signIn() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);
    const [sendEmailVerification, setSendEmailVerification] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        email_verification_code: ''
    });

    function changeShowPassword() { setShowPassword((prev) => !prev); }

    async function inputValidations() {
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        const pMessage = document.getElementById('pMessage');

        setLoading(true);

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(inputEmail.value)) {
            pMessage.textContent = 'Invalid email';
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch('/api/users/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: inputEmail.value })
            });
            const resData = await res.json();
            if(!resData.isRegistered) {
                pMessage.textContent = 'Email is not registered';
                setLoading(false);
                return false;
            }
        } catch (error) {
            setLoading(false);
            console.log('Error in fetch to check if the email is already registered: ', error);
            return false;
        }

        if (inputPassword.value.trim().length < 6 || inputPassword.value.trim().length > 16) {
            pMessage.textContent = 'The password must contain between 6 and 16 characters';
            setLoading(false);
            return false;
        } else if (inputPassword.value.includes(' ')) {
            pMessage.textContent = 'Password cannot contain spaces';
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch('/api/users/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: inputEmail.value, password: inputPassword.value })
            });
            const resData = await res.json();
            if(!resData.isPassword) {
                pMessage.textContent = 'Incorrect password';
                setLoading(false);
                return false;
            }
        } catch (error) {
            setLoading(false);
            console.log('Error in fetch to verify password: ', error);
            return false;
        }
        
        setLoading(false);
        return true;
    }

    async function startEmailVerification() {
        if (!await inputValidations()) {
            return;
        }

        setLoading(true);

        const inputEmail = document.getElementById('inputEmail');
        sendEmailVerification(inputEmail.value);
        setFormData({
            email: inputEmail.value,
            email_verification_code: ''
        });

        const spanUserEmail = document.getElementById('spanUserEmail');
        spanUserEmail.textContent = inputEmail.value;

        setLoading(false);
        setDisplayEmailVerification(true);
    }

    function restartForm() {
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');
        const pMessage = document.getElementById('pMessage');
        inputEmail.value = '';
        inputPassword.value = '';
        pMessage.textContent = '';
        setFormData({
            email: '',
            email_verification_code: ''
        });

        setDisplayEmailVerification(false);
    }

    async function finishForm() {
        const updatedFormData = {
            ...formData,
            email_verification_code: document.getElementById('inputEmailVerificationCode').value
        }

        const pMessageEmailVerification = document.getElementById('pMessageEmailVerification');
        try {
            const res = await fetch('/api/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            });
            const resData = await res.json();
            pMessageEmailVerification.textContent = resData.message;
            if(resData.token) {
                localStorage.setItem('userToken', JSON.stringify(resData.token));
                router.push('/');
            }
        } catch (error) {
            console.log('Error fetching to connect user: ', error);
        }
    }

    return (
        <div>

            <form className="formLayout-form flex-center flex-column" style={displayEmailVerification ? { display: 'none' } : { display: 'flex' }}>

                <h1 className="formLayout-title text-center">Sign In</h1>

                <label htmlFor="inputEmail" className="formLayout-label">Email:</label>
                <input type="email" className='formLayout-input' name="inputEmail" id="inputEmail" required />

                <label htmlFor="inputPassword " className="formLayout-label">Password:</label>
                <input type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />
                <div className="formLayout-label-container-checkbox-show-password flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Show password:</label>
                </div>

                <button type="button" onClick={() => startEmailVerification()} className='formLayout-button'>Sign In</button>

                <Link className='formLayout-button-simple text-center' onClick={() => {setLoading(true)}} href='/form/signup'>Don't have an account? Sign up here</Link>

                <p className="formLayout-message text-center" id='pMessage'></p>

                <p className='formLayout-loading text-center flex-center' style={loading ? {display: 'flex'} : {display: 'none'}}>Loading...</p>

            </form>

            <div style={displayEmailVerification ? { display: 'flex' } : { display: 'none' }}>
                <EmailVerification actions={{ finishForm, restartForm, setSendEmailVerification, isSignUp: false }} />
            </div>

        </div>
    );
}