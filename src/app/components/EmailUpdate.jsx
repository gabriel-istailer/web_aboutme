'use client';

import { useState } from 'react';

import './EmailUpdate.css';

export default function EmailUpdate({ user }) {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [displayEmailVerification, setDisplayEmailVerification] = useState(false);

    async function inputValidations() {

        setLoading(true);
        
        const currentEmail = user?.email;
        if(email === currentEmail) {
            setMessage('This email is already your current email');
            setLoading(false);
            return false;
        }

        const regex_email_validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex_email_validation.test(email)) {
            setMessage('Invalid email');
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch(`/api/users/get?email=${email}`);
            const resData = await res.json();
            if (resData.user) {
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

    }

    return (
        <div className="EmailUpdate">
            <form onSubmit={handleSubmit} className="emailUpdate-form flex-center flex-column" style={displayEmailVerification ? {display: 'none'} : {display: 'flex'}}>
                <label htmlFor="emailUpdateInput" className="emailUpdate-label">Your new email:</label>
                <input type="email" className="emailUpdate-input" onChange={(e) => { setEmail(e.target.value) }} name="newEmail" id="emailUpdateInput" />
                <button type="submit" className="emailUpdate-submit">Verify new email</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }}>Loading...</p>
            </form>
            <div className="emailUpdate-verification-email flex-center flex-column" style={displayEmailVerification ? {display: 'flex'} : {display: 'none'}}>
                <p>We sent a verification email to {email}, please check your new email in 2 minutes to update it.</p>
            </div>
        </div>
    );
}