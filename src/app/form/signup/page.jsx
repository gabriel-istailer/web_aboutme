'use client';

import './page.css';
import '../layout.css';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function signUp() {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    function changeShowPassword() { setShowPassword((prev) => !prev); }

    async function inputValidations() {
        setLoading(true);

        if (name.trim().length < 3 || name.trim().length > 50) {
            setMessage('The name must contain between 3 and 50 characters');
            setLoading(false);
            return false;
        }

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(email)) {
            setMessage('Invalid email');
            setLoading(false);
            return false;
        }

        if (password.trim().length < 6 || password.trim().length > 16) {
            setMessage('The password must contain between 6 and 16 characters');
            setLoading(false);
            return false;
        } else if(password.includes(' ')) {
            setMessage('Password cannot contain spaces');
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch(`/api/users/get?email=${email}`);
            const resData = await res.json();
            if(resData.user) {
                setMessage('This email is already registered');
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.log('Error in fetch to check if the email is already registered: ', error);
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await inputValidations()) {
            return;
        }

        try {
            const res = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
        } catch (error) {
            console.log('Error fetching to start registration: ', error);
            return false;
        }



    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="formLayout-form flex-center flex-column" id='formSignUp'>

                <h1 className="formLayout-title text-center">Sign Up</h1>

                <label htmlFor="inputName" className='formLayout-label'>Name:</label>
                <input value={name} onChange={e => {setName(e.target.value)}} type="text" className='formLayout-input' name="inputName" id="inputName" maxLength={50} minLength={3} required />

                <label htmlFor="inputEmail" className='formLayout-label'>Email:</label>
                <input value={email} onChange={e => {setEmail(e.target.value)}} type="email" className='formLayout-input' name="inputEmail" id="inputEmail" required />

                <label htmlFor="inputPassword" className='formLayout-label'>Password:</label>
                <input value={password} onChange={e => {setPassword(e.target.value)}} type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />

                <div className="formLayout-label-container-checkbox-show-password flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Show password:</label>
                </div>

                <button type="submit" className='formLayout-button'>Sign Up</button>

                <Link className='formLayout-button-simple text-center' onClick={() => {setLoading(true)}} href='/form/signin'>Already have an account? Then sign in here.</Link>

                <p className="formLayout-message text-center" id='pMessage'>{message}</p>

                <p className='formLayout-loading text-center flex-center' style={loading ? {display: 'flex'} : {display: 'none'}}>Loading...</p>

            </form>

            <div className="formLayout-form flex-center flex-column" id='startEmailVerification'>
                <h1>Email Verification</h1>
                <p>Please check your email!</p>
            </div>

        </div>
    );
}