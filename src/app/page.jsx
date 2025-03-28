'use client';

import './page.css';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if(!userToken) {
            return;
        }
        const fetchGetUser = async () => {
            try {
                const res = await fetch('/api/users/get-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: userToken })
                });
    
                const resData = await res.json();
                console.log(resData.user);
                setUser(resData.user);
    
            } catch (error) {
                console.log('Erro no fetch de pegar o usuário no servidor:', error);
            }
        };
        fetchGetUser();
    }, []);

    return (
        <div className='home'>
            <header className="home-header">
                <nav className="home-header-nav flex-v-center">
                    <Link className='title font-LilyScriptOne' href='/'>AboutMe</Link>
                    <Link className='link font-Sanchez' href='/form/signup'>Cadastrar</Link>
                    <Link className='link font-Sanchez' href='/form/signin'>Entrar</Link>
                </nav>
                <section className="home-header-section flex-center flex-column">
                    <h1 className="slogan">Cadastre-se e compartilhe-nos sua história!</h1>
                    <p className="description text-center">
                        O site AboutMe tem como ideia principal conectar histórias do mundo todo, compartilhando
                        experiências e aconselhando outras pessoas a completarem suas histórias.
                    </p>
                </section>
            </header>
            <main className="home-main">
                <nav className="home-main-nav">
                    <input type="search" className='search' name="search" id="search"/>
                </nav>
            </main>
            <footer className="home-footer">

            </footer>
        </div>
    );
}
