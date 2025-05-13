'use client';

import '../layout.css';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [alertRecoveryPassword, setAlertRecoveryPassword] = useState(false);

    function changeShowPassword() { setShowPassword((prev) => !prev); }

    async function emailValidation() {
        setLoading(true);

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(email)) {
            setMessage('Invalid email, please enter a valid email');
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch(`/api/users/get?email=${email}`);
            const resData = await res.json();
            if(!resData.user) {
                setMessage('Email is not registered');
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.log('Error in fetch to check if the email is already registered: ', error);
            setMessage('Error');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function inputValidations() {
        
        if(!await emailValidation()) {
            return false;
        }

        setLoading(true);
        
        if (password.trim().length < 6 || password.trim().length > 16) {
            setMessage('The password must contain between 6 and 16 characters');
            setLoading(false);
            return false;
        } else if (password.includes(' ')) {
            setMessage('Password cannot contain spaces');
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch('/api/users/verify/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const resData = await res.json();
            if(!resData.isPassword) {
                setMessage('Incorrect password');
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.log('Error in fetch to verify password: ', error);
            setMessage('Error');
            setLoading(false);
            return false;
        }
        
        setLoading(false);
        return true;
    }

    async function recoveryPassword() {
        if(!await emailValidation()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/users/signin/recover-password?email=${email}`);
        } catch (error) {
            console.log('Error in fetching password recovery email: ', error);
            setMessage('Error');
            setLoading(false);
            return;
        }

        setShowPassword(false);
        setAlertRecoveryPassword(true);
        setLoading(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!await inputValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const resData = await res.json();
            if(resData.token) {
                localStorage.setItem('userToken', JSON.stringify(resData.token));
                setMessage(resData.message);
                router.push('/');
            }
        } catch (error) {
            console.log('', error);
            setMessage('Error');
            setLoading(false);
            return;
        }
    }

    return (
        <div>

            <form onSubmit={handleSubmit} className="formLayout-form flex-center flex-column" style={alertRecoveryPassword ? { display: 'none' } : { display: 'flex' }}>

                <h1 className="formLayout-title text-center">Sign In</h1>

                <label htmlFor="inputEmail" className="formLayout-label">Email:</label>
                <input value={email} onChange={e => {setEmail(e.target.value)}} type="email" className='formLayout-input' name="inputEmail" id="inputEmail" required />

                <label htmlFor="inputPassword " className="formLayout-label">Password:</label>
                <input value={password} onChange={e => {setPassword(e.target.value)}} type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />

                <div className="formLayout-button-container flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Show password:</label>
                    
                    <button className='formLayout-forget-password text-center' onClick={recoveryPassword} type="button">Forgot your password?</button>
                </div>

                <button type="submit" className='formLayout-button'>Sign In</button>

                <Link className='formLayout-button-simple text-center' onClick={() => {setLoading(true)}} href='/form/signup'>Don't have an account? Sign up here</Link>

                <p className="formLayout-message text-center" id='pMessage'>{message}</p>

                <p className='formLayout-loading text-center flex-center' style={loading ? {display: 'flex'} : {display: 'none'}}>Loading...</p>

            </form>

            <div className="formLayout-form flex-center flex-column" style={alertRecoveryPassword ? {display: 'flex'} : {display: 'none'}}>
                <h1 className='formLayout-title text-center'>Recovery Password</h1>
                <p className='formLayout-advice text-center'>
                    We have sent a password recovery email to {email}. 
                    Please follow the link in the email to recover your password, 
                    the link expires in 2 minutes.
                </p>
            </div>

        </div>
    );
}