'use client';

import './components.css';

import { useState } from 'react';

export default function GenderUpdate({ user, setUser}) {

    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function genderValidations() {

        setLoading(true);
        
        const currentGender = user?.gender;
        if(gender === currentGender) {
            setMessage('This gender is already your current gender');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await genderValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/gender', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({gender, email: user.email})
            });
            const resData = await res.json();
            if(resData.status === 201) {
                setMessage(resData.message);
            }
        } catch (error) {
            console.log('Error fetching to update user gender: ', error);
            setMessage('Error');
        }

        setUser(prev => ({
            ...prev,
            gender
        }));

        setLoading(false);
    }

    return (
        <div className="GenderUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentGender" className='components-label'>Current gender:</label>
                <p className='components-data'>{user.gender ? user.gender : "undefined"}</p>
                <label htmlFor="genderUpdateSelect" className="components-label">Select your new gender:</label>
                <select className="components-select" onChange={e => { setGender(e.target.value) }} name="genderUpdateSelect" id="genderUpdateSelect">
                    <option className='components-option' value="masculine">masculine</option>
                    <option className='components-option' value="feminine">feminine</option>
                </select>
                <button type="submit" className="components-btn-submit">Update gender</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
            </form>
        </div>
    );
}