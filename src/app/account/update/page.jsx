'use client';

import '../layout.css';
import './page.css';

import ProfileImageUpdate from '../../components/ProfileImageUpdate';
import NameUpdate from '../../components/NameUpdate';

import { useState, useEffect } from 'react';
import LoadingPage from '../../components/LoadingPage';
import { useRouter } from 'next/navigation';
import EmailUpdate from '../../components/EmailUpdate';
import ProfessionUpdate from '../../components/ProfessionUpdate';
import HobbiesUpdate from '../../components/HobbiesUpdate';
import GenderUpdate from '../../components/GenderUpdate';
import BirthDateUpdate from '../../components/BirthDateUpdate';
import BiographyUpdate from '../../components/BiographyUpdate';
import PasswordUpdate from '../../components/PasswordUpdate';

export default function UpdateAccount() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectToUpdate, setSelectToUpdate] = useState(null);

    useEffect(() => {
        setLoading(true);
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if(!userToken) {
            router.push('/');
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
                router.push('/');
                setLoading(false);
            }
        };
        fetchGetUser();
    }, []);

    function renderSelectedComponent() {
        switch (selectToUpdate) {
            case 'profile_image':
                return <ProfileImageUpdate user={user} setUser={setUser} />;
                break;
            case 'name':
                return <NameUpdate user={user} setUser={setUser} />;
                break;
            case 'email':
                return <EmailUpdate user={user} setUser={setUser} />;
                break;
            case 'profession':
                return <ProfessionUpdate user={user} setUser={setUser} />;
                break;
            case 'hobbies':
                return <HobbiesUpdate user={user} setUser={setUser} />;
                break;
            case 'gender':
                return <GenderUpdate user={user} setUser={setUser} />;
                break;
            case 'birth_date':
                return <BirthDateUpdate user={user} setUser={setUser} />
                break;
            case 'biography':
                return <BiographyUpdate user={user} setUser={setUser} />
                break;
            case 'password':
                return <PasswordUpdate user={user} setUser={setUser} />
                break;
            default:
                return <ProfileImageUpdate user={user} setUser={setUser} />;
                break;
        }
    }

    if(loading) {
        return <LoadingPage />;
    }

    return (
        <div className='UpdateAccount'>
            <main className='account-update-main flex-center'>
                <div className="account-update-main-div smooth-animation flex-center flex-column">
                    <h1 className="account-update-main-div-title">Update your account</h1>
                    <label className='account-update-main-div-label' htmlFor="selectUserDataOptions">Select the account information you want to change:</label>
                    <select className='account-update-main-div-select' onChange={e => { setSelectToUpdate(e.target.value) }} name="selectUserDataOptions" id="selectUserDataOptions">
                        <option className='account-update-main-div-option' value="profile_image">Profile Image</option>
                        <option className='account-update-main-div-option' value="name">Name</option>
                        <option className='account-update-main-div-option' value="email">Email</option>
                        <option className='account-update-main-div-option' value="password">Password</option>
                        <option className='account-update-main-div-option' value="gender">Gender</option>
                        <option className='account-update-main-div-option' value="birth_date">Date of Birth</option>
                        <option className='account-update-main-div-option' value="profession">Profession</option>
                        <option className='account-update-main-div-option' value="hobbies">Hobbies</option>
                        <option className='account-update-main-div-option' value="biography">Biography</option>
                    </select>

                    {renderSelectedComponent()}

                </div>
            </main>
        </div>
    );
}