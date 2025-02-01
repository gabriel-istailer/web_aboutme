import './page.css';

import Link from 'next/link';

export default function Home() {

    const isRegistered = true;

    return (
        <div className='home'>
            <header className="home-header">
                <nav className="home-header-nav flex-v-center">
                    <Link className='title font-LilyScriptOne' href='/'>AboutMe</Link>
                    <Link className='link font-Sanchez' href='/register?isRegistered=no'>Cadastrar</Link>
                    <Link className='link font-Sanchez' href='/register?isRegistered=yes'>Entrar</Link>
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
