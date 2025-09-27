'use client';

import './components.css';

import { useState } from 'react';

export default function PasswordUpdate({ user }) {

    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function passwordsValidations() {

        setLoading(true);

        if(currentPassword.trim().length < 6 || currentPassword.trim().length > 16) {
            setMessage('The current password must contain between 6 and 16 characters');
            setLoading(false);
            return false;
        } else if (currentPassword.includes(' ')) {
            setMessage('The current password cannot contain spaces');
            setLoading(false);
            return false;
        }

        if(password.trim().length < 6 || password.trim().length > 16) {
            setMessage('The password must contain between 6 and 16 characters');
            setLoading(false);
            return false;
        } else if (password.includes(' ')) {
            setMessage('The password cannot contain spaces');
            setLoading(false);
            return false;
        }
        
        try {
            const res = await fetch('/api/users/verify/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user?.email, password: currentPassword })
            });
            const resData = await res.json();
            if(!resData.isPassword) {
                setMessage('Current password incorrect');
                setLoading(false);
                return false;
            }
            const res2 = await fetch('/api/users/verify/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user?.email, password })
            });
            const resData2 = await res2.json();
            if(resData2.isPassword) {
                setMessage('This password is already your current password');
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

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await passwordsValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password, email: user.email, isToken: false})
            });
            const resData = await res.json();
            setMessage(resData.message);
        } catch (error) {
            console.log('Error fetching to update user password: ', error);
            setMessage('Error');
        }

        setLoading(false);
    }

    return (
        <div className="PasswordUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentPasswordUpdateInput" className="components-label">Your current password:</label>
                <input type={showPassword1 ? 'text' : 'password'} className="components-input" onChange={(e) => { setCurrentPassword(e.target.value) }} name="currentPassword" id="currentPasswordUpdateInput" />

                <label htmlFor="showPassword1" className={showPassword1 ? 'components-checkbox-show-password' : 'components-checkbox-hide-password'}>Show password:</label>
                <input type="checkbox" onChange={() => { setShowPassword1(prev => !prev) }} name="showPassword1" id="showPassword1" style={{display: 'none'}}/>

                <label htmlFor="passwordUpdateInput" className="components-label">Your new password:</label>
                <input type={showPassword2 ? 'text' : 'password'} className="components-input" onChange={(e) => { setPassword(e.target.value) }} name="newPassword" id="passwordUpdateInput" />

                <label htmlFor="showPassword2" className={showPassword2 ? 'components-checkbox-show-password' : 'components-checkbox-hide-password'}>Show password:</label>
                <input type="checkbox" onChange={() => { setShowPassword2(prev => !prev) }} name="showPassword2" id="showPassword2" style={{display: 'none'}}/>

                <button type="submit" className="components-btn-submit">Update password</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
            </form>
        </div>
    );
}