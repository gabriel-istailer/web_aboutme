'use client';

import '../layout.css';
import './page.css'

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DeleteAccount() {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);

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

    async function handleSubmit() {

    }


    return (
        <div className="DeleteAccount flex-center">
            <main className='main smooth-animation flex-center flex-column'>
                <h1 className='title'>Delete Account</h1>
                <form onSubmit={handleSubmit} className='flex-center flex-column'>
                    <label htmlFor="inputEmail" className='label'>Your email:</label>
                    <input type="email" name='inputEmail' id="inputEmail" className='input' required />

                    <label htmlFor="inputPassword" className='label'>Your password:</label>
                    <input type="password" name='inputPassword' id="inputPassword" className='input' required />

                    <label htmlFor="inputConfirmPassword" className='label'>Confirm your password:</label>
                    <input type="password" name='inputConfirmPassword' id="inputConfirmPassword" className='input' required />

                    <button type="submit" className='btn-submit'>Delete Account</button>
                </form>
                <Link className='back' href="/account">&lt;back</Link>
            </main>
        </div>
    );
}