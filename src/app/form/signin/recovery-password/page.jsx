'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RecoveryPassword() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [displayForm, setDisplayForm] = useState(false);
    const [message, setMessage] = useState('');

    function changeShowPassword() { setShowPassword((prev) => !prev); }

    useEffect(() => {
        async function verifyToken() {
            setLoading(true);
            if(!token) {
                setMessage('Token not provided');
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/users/signin/recover-password/verify?token=${token}`);
                const resData = await res.json();
                setMessage(resData.message);
                if(resData.email) {
                    setEmail(resData.email);
                    setDisplayForm(true);
                }
                setLoading(false);
                return;
            } catch (error) {
                console.log('Error in fetch verifying page token: ', error);
                setMessage('Error');
                setLoading(false);
                return;
            }
        }
        verifyToken();
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        if (newPassword.trim().length < 6 || newPassword.trim().length > 16) {
            setMessage('The password must contain between 6 and 16 characters');
            setLoading(false);
            return;
        } else if (newPassword.includes(' ')) {
            setMessage('Password cannot contain spaces');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/users/update/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password: newPassword,
                    isToken: false
                })
            });
            const resData = await res.json();
            setMessage(resData.message);
            router.push('/form/signin');
            setLoading(false);
            return;
        } catch (error) {
            console.log('Error fetching password update: ', error);
            setMessage('Error');
            setLoading(false);
            return;
        }
    }

    return (
        <div className="RecoveryPassword">

            <div className="formLayout-form flex-center flex-column" style={displayForm ? {display: 'none'} : {display: 'flex'}}>
                <h1 className='formLayout-title text-center'>Recovery Password</h1>
                <p className="formLayout-advice text-center">{message}</p>
                <p className="formLayout-loading text-center" style={loading ? {display: 'block'} : {display: 'none'}} >Loading...</p>
            </div>
            
            <form onSubmit={handleSubmit} className="formLayout-form flex-center flex-column" style={displayForm ? {display: 'flex'} : {display: 'none'}}>
                <h1 className='formLayout-title text-center'>Recovery Password</h1>

                <label htmlFor="inputPassword " className="formLayout-label">Password:</label>
                <input value={newPassword} onChange={e => {setNewPassword(e.target.value)}} type={showPassword ? 'text' : 'password'} className='formLayout-input' name="inputPassword" id="inputPassword" required />

                <div className="formLayout-button-container flex-v-center">
                    <input type="checkbox" checked={showPassword} onChange={() => changeShowPassword()} className='formLayout-checkbox-show-password' name="checkboxShowPassword" id="checkboxShowPassword" />
                    <label htmlFor="checkboxShowPassword" className='formLayout-label-checkbox-show-password'>Show password:</label>
                </div>

                <button type="submit" className="formLayout-button">Update password</button>

                <p className="formLayout-message text-center">{message}</p>
                <p className="formLayout-loading text-center" style={loading ? {display: 'block'} : {display: 'none'}} >Loading...</p>
            </form>
        </div>
    );
}