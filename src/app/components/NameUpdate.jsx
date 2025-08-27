'use client';

import './components.css';

import { useState } from 'react';

export default function NameUpdate() {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function nameValidations() {

        setLoading(true);
        
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



        setLoading(false);
    }

    return (
        <div className="NameUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="nameUpdateInput" className="components-label">Your new name:</label>
                <input type="email" className="components-input" onChange={(e) => { setName(e.target.value) }} name="newName" id="nameUpdateInput" />
                <button type="submit" className="components-btn-submit">Update name</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }}>Loading...</p>
            </form>
        </div>
    );
}