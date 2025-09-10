'use client';

import './components.css';

import { useState } from 'react';

export default function BiographyUpdate({ user }) {

    const [biography, setBiography] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function biographyValidations() {

        setLoading(true);
        
        const currentBiography = user?.biography;
        if(biography === currentBiography) {
            setMessage('This biography is already your current biography');
            setLoading(false);
            return false;
        }

        if(biography.length < 3 || biography.length > 4000) {
            setMessage('The biography must contain between 3 and 4000 characters');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await biographyValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/biography', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({biography, email: user.email})
            });
            const resData = await res.json();
            if(resData.status === 201) {
                setMessage(resData.message);
            }
        } catch (error) {
            console.log('Error fetching to update user profession: ', error);
            setMessage('Error');
        }

        setUser(prev => ({
            ...prev, 
            biography
        }));

        setLoading(false);
    }

    return (
        <div className="BiographyUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentBiography" className='components-label'>Current biography:</label>
                <p className='components-data'>{user.biography ? user.biography : "undefined"}</p>
                <label htmlFor="biographyUpdateInput" className="components-label">Your new biography:</label>
                <input type="text" className="components-input" onChange={(e) => { setBiography(e.target.value) }} name="newBiography" id="biographyUpdateInput" />
                <button type="submit" className="components-btn-submit">Update biography</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }}>Loading...</p>
            </form>
        </div>
    );
}