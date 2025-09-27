'use client';

import '../layout.css';
import './page.css'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DeleteAccount() {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if (!userToken) {
            setUser(false);
            setLoading(false);
            return;
        }
        const fetchGetUser = async () => {
            try {
                const res = await fetch(`/api/users/get?token=${userToken}`);
                const resData = await res.json();
                setUser(resData.user);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching the user from the server: ', error);
            }
        };
        fetchGetUser();
    }, []);

    async function inputValidations() {
        const currentEmail = user?.email;
        if(email !== currentEmail) {
            setMessage('This is not your email');
            return false;
        }

        if(password !== confirmPassword) {
            setMessage('The passwords are different');
            return false;
        }

        try {
            const res = await fetch('/api/users/verify/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });
            const resData = await res.json();
            if(!resData?.isPassword) {
                setMessage('Incorrect password');
                return false;
            }
        } catch (error) {
            console.log('Error in fetch to verify user password: ', error);
            setMessage('Error');
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        if(!await inputValidations()) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/users/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            });
            const resData = await res.json();
            console.log(resData);
            if(resData?.status === 201) {
                console.log('AAAAAAAAA');
                localStorage.removeItem('userToken');
                router.push('/');
            }
        } catch (error) {
            console.log('Error in fetch to delete user: ', error);
            setMessage('Error');
            setLoading(false);
        }

        setLoading(false);
    }

    return (
        <div className="DeleteAccount flex-center">
            <main className='main smooth-animation flex-center flex-column'>
                <h1 className='title'>Delete Account</h1>
                <form onSubmit={handleSubmit} className='flex-center flex-column'>
                    <label htmlFor="inputEmail" className='label'>Your email:</label>
                    <input type="email" onChange={(e) => {setEmail(e.target.value)}} name='inputEmail' id="inputEmail" className='input' required />

                    <label htmlFor="inputPassword" className='label'>Your password:</label>
                    <input type={showPassword1 ? 'text' : 'password'} onChange={(e) => {setPassword(e.target.value)}} name='inputPassword' id="inputPassword" className='input' required />

                    <label htmlFor="showPassword1" className={showPassword1 ? 'show-password' : 'hide-password'}>Show password:</label>
                    <input type="checkbox" onChange={() => { setShowPassword1(prev => !prev) }} name="showPassword1" id="showPassword1" style={{display: 'none'}}/>                

                    <label htmlFor="inputConfirmPassword" className='label'>Confirm your password:</label>
                    <input type={showPassword2 ? 'text' : 'password'} onChange={(e) => {setConfirmPassword(e.target.value)}} name='inputConfirmPassword' id="inputConfirmPassword" className='input' required />

                    <label htmlFor="showPassword2" className={showPassword2 ? 'show-password' : 'hide-password'}>Show password:</label>
                    <input type="checkbox" onChange={() => { setShowPassword2(prev => !prev) }} name="showPassword2" id="showPassword2" style={{display: 'none'}}/>

                    <button type="submit" className='btn-submit'>Delete Account</button>
                    <p style={message ? {display: 'flex'} : {display: 'none'}} className='message'>{message}</p>
                    <p style={loading ? {display: 'flex'} : {display: 'none'}} className='loading'>Loading</p>
                </form>
                <Link className='back' href="/account">&lt;back</Link>
            </main>
        </div>
    );
}