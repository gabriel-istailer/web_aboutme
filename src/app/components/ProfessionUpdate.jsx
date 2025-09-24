'use client';

import './components.css';

import { useState } from 'react';

export default function ProfessionUpdate({ user, setUser }) {

    const [profession, setProfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function professionValidations() {

        setLoading(true);
        
        const currentProfession = user?.profession;
        if(profession === currentProfession) {
            setMessage('This profession is already your current profession');
            setLoading(false);
            return false;
        }

        if(profession.trim().length < 3 || profession.trim().length > 50) {
            setMessage('The profession must contain between 3 and 50 characters');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await professionValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/profession', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({profession, email: user.email})
            });
            const resData = await res.json();
            setMessage(resData.message);
        } catch (error) {
            console.log('Error fetching to update user profession: ', error);
            setMessage('Error');
        }

        setUser(prev => ({
            ...prev, 
            profession
        }));

        setLoading(false);
    }

    return (
        <div className="ProfessionUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentProfession" className='components-label'>Current profession:</label>
                <p className='components-data'>{user.profession ? user.profession : "undefined"}</p>
                <label htmlFor="professionUpdateInput" className="components-label">Your new profession:</label>
                <input type="text" className="components-input" onChange={(e) => { setProfession(e.target.value) }} name="newProfession" id="professionUpdateInput" />
                <button type="submit" className="components-btn-submit">Update profession</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
            </form>
        </div>
    );
}