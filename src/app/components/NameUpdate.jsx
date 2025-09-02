'use client';

import './components.css';

import { useState } from 'react';

export default function NameUpdate({ user }) {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function nameValidations() {

        setLoading(true);
        
        const currentName = user?.name;
        if(name === currentName) {
            setMessage('This name is already your current name');
            setLoading(false);
            return false;
        }

        if(name.trim().length < 3 || name.trim().length > 50) {
            setMessage('The name must contain between 3 and 50 characters');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await nameValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/name', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email: user.email})
            });
            const resData = await res.json();
            if(resData.status === 201) {
                setMessage(resData.message);
            }
        } catch (error) {
            console.log('Error fetching to update username: ', error);
            setMessage('Error');
        }

        setLoading(false);
        window.location.reload();
    }

    return (
        <div className="NameUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentEmail" className='components-label'>Current name:</label>
                <p className='components-data'>{user.name}</p>
                <label htmlFor="nameUpdateInput" className="components-label">Your new name:</label>
                <input type="text" className="components-input" onChange={(e) => { setName(e.target.value) }} name="newName" id="nameUpdateInput" />
                <button type="submit" className="components-btn-submit">Update name</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }}>Loading...</p>
            </form>
        </div>
    );
}