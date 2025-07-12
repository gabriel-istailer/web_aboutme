'use client';

import './layout.css';
import './page.css'

import LoadingPage from '../components/LoadingPage';

import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function Account() {

    const [user, setUser] = useState(null);
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

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="Account">

            <main className="account-main flex-center smooth-animation">

                <div className='account-main-div flex'>

                    <section className="account-main-sections account-main-section-1 flex-center flex-column">
                        <h1 className="account-main-section-title text-center">Profile picture:</h1>
                        <img className="account-main-section-profile-img" src={user.profile_image_path} width='300px' height='300px' alt="profile_picture" />
                        <p>300x300</p>
                        <p>{user.name}</p>
                    </section>

                    <section className="account-main-sections account-main-section-2 flex-column">

                        <h1 className="account-main-section-title text-center">Account information:</h1>

                        <div className="account-main-section-scroll-area flex-column">

                            <label htmlFor="pAccountMainSectionInfoName" className="account-main-section-label">Name:</label>
                            <p className='account-main-section-info' id='pAccountMainSectionInfoName'>{user.name}</p>


                            <label htmlFor="pAccountMainSectionInfoEmail" className="account-main-section-label">Email:</label>
                            <p className="account-main-section-info" id="pAccountMainSectionInfoEmail">{user.email}</p>


                            <label htmlFor="pAccountMainSectionInfoGender" className="account-main-section-label">Gender:</label>
                            <p className="account-main-section-info" id="pAccountMainSectionInfoGender">{user.gender ? user.gender : 'undefined'}</p>


                            <label htmlFor="pAccountMainSectionInfoBirthDate" className="account-main-section-label">Date of birth:</label>
                            <p className="account-main-section-info" id="pAccountMainSectionInfoBirthDate">{user.birth_date ? user.birth_date : 'undefined'}</p>

                            <label htmlFor="pAccountMainSectionInfoAge" className="account-main-section-label">Age:</label>
                            <p className="account-main-section-info" id="pAccountMainSectionInfoAge">{user.age ? user.age : 'undefined'}</p>

                            <label htmlFor="pAccountMainSectionInfoProfession" className='account-main-section-label'>Profession:</label>
                            <p className="account-main-section-info" id="pAccountMainSectionInfoProfession">{user.profession ? user.profession : 'undefined'}</p>

                            <label htmlFor="pAccountMainSectionInfoHobbies" className="account-main-section-label">Hobbies:</label>
                            <p className="account-main-section-info" id='pAccountMainSectionInfoHobbies'>{user.hobbies ? user.hobbies : 'undefined'}</p>
                            {/* Descompactar hobbies aqui */}

                            <label htmlFor="pAccountMainSectionInfoBiography" className="account-main-section-label">Biography:</label>
                            <p className="account-main-section-info" id='pAccountMainSectionInfoBiography'>{user.biography ? user.biography : 'undefined'}</p>

                        </div>

                        <div className="account-main-section-1-buttons flex-center">
                            <Link className='account-main-section-1-button account-main-section-1-update-button' href='/account/update'>Update Account</Link>
                            <Link className='account-main-section-1-button account-main-section-1-delete-button' href='/account/delete'>Delete Account</Link>
                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}