'use client';

import '../layout.css';
import './page.css';

import ProfileImageUpdate from '../../components/ProfileImageUpdate';
import NameUpdate from '../../components/NameUpdate';

import { useState, useEffect } from 'react';
import LoadingPage from '../../components/LoadingPage';
import { useRouter } from 'next/navigation';

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
                return <ProfileImageUpdate user={user} />;
                break;
            case 'name':
                return <NameUpdate />;
                break;
            default:
                return <ProfileImageUpdate user={user} />;
                break;
        }
    }

    if(loading) {
        return <LoadingPage />;
    }

    return (
        <div className='UpdateAccount'>
            <main className='account-update-main flex-center'>
                <form className="account-update-main-form smooth-animation flex-center flex-column">
                    <h1 className="account-update-main-form-title">Update your account</h1>
                    <label className='account-update-main-form-label' htmlFor="selectUserDataOptions">Select the account information you want to change:</label>
                    <select className='account-update-main-form-select' onChange={e => { setSelectToUpdate(e.target.value) }} name="selectUserDataOptions" id="selectUserDataOptions">
                        <option className='account-update-main-form-option' value="profile_image">Profile Image</option>
                        <option className='account-update-main-form-option' value="name">Name</option>
                        <option className='account-update-main-form-option' value="email">Email</option>
                        <option className='account-update-main-form-option' value="gender">Gender</option>
                        <option className='account-update-main-form-option' value="birth_date">Date of Birth</option>
                        <option className='account-update-main-form-option' value="profession">Profession</option>
                        <option className='account-update-main-form-option' value="hobbies">Hobbies</option>
                        <option className='account-update-main-form-option' value="biography">Biography</option>
                    </select>

                    {renderSelectedComponent()}

                </form>
            </main>
        </div>
    );
}