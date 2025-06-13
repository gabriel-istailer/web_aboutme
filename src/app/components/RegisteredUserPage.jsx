'use client';

import Link from "next/link";

export default function RegisteredUserPage({ user }) {

    function handleLeaveAccount() {
        localStorage.removeItem('userToken');
        window.location.reload();
    }

    return (
        <div className="RegisteredUserPage" style={{maxWidth: '100%'}}>
            <nav className="home-header-nav flex-v-center">
                <Link className='home-header-nav-title font-LilyScriptOne smooth-animation' href='/'>AboutMe</Link>
                <Link className='home-header-nav-profile-image font-Sanchez smooth-animation' style={{backgroundImage: `url(${user.profile_image_path})`}} href='/'></Link>

                <div className="home-header-nav-dropdown smooth-animation">
                    <Link className='home-header-nav-link home-header-nav-dropdown-dad-link font-Sanchez' href='/account'>Account</Link>
                    <div className="home-header-nav-dropdown-links">
                        <Link className="home-header-nav-dropdown-child-link font-Sanchez" href='/account'>Account</Link>
                        <Link className="home-header-nav-dropdown-child-link font-Sanchez" href='/'>Profile</Link>
                        <button type="button" className="home-header-nav-dropdown-child-link font-Sanchez" onClick={handleLeaveAccount}>Leave</button>
                    </div>
                </div>


            </nav>
            <section className="home-header-section flex-center flex-column">
                <h1 className="home-header-section-slogan smooth-animation">Hello, {user.name}!</h1>
                <p className="home-header-section-description text-center smooth-animation">
                    The AboutMe website's main idea is to connect stories from all over the world,
                    sharing experiences and advising other people to complete their stories.
                </p>
            </section>
        </div>
    );
}