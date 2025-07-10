'use client';

import './page.css';

import LoadingPage from './components/LoadingPage';
import NotRegisteredUserPage from './components/NotRegisteredUserPage';
import RegisteredUserPage from './components/RegisteredUserPage';

import { useState, useEffect } from 'react';

export default function Home() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if(!userToken) {
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
                setLoading(false);
            }
        };
        fetchGetUser();
    }, []);

    if(loading) {
        return <LoadingPage />;
    }

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
