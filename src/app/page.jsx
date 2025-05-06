'use client';

import './page.css';

import NotRegisteredUserPage from './components/NotRegisteredUserPage';
import RegisteredUserPage from './components/RegisteredUserPage';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if(!userToken) {
            setUser(false);
            return;
        }
        const fetchGetUser = async () => {
            try {
                setLoading(true)
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

    return (
        <div className='home'>
            <header className="home-header">
                <div style={loading ? {display: 'none'} : {display: 'flex'}}>
                    {user ? <RegisteredUserPage user={user} /> : <NotRegisteredUserPage />}
                </div>
            </header>
            <main className="home-main">
                <nav className="home-main-nav"></nav>
            </main>
            <footer className="home-footer">

            </footer>
        </div>
    );
}
