'use client';

import './components.css';

import { useState } from 'react';

export default function BirthDateUpdate({ user, setUser}) {

    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function birthDateValidations() {

        setLoading(true);
        
        const currentBirthDate = user?.birth_date;
        if(birthDate === currentBirthDate) {
            setMessage('This date of birth is already your current date of birth');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await birthDateValidations()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/update/birth_date', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({birthDate, email: user.email})
            });
            const resData = await res.json();
            if(resData.status === 201) {
                setMessage(resData.message);
            }
            setUser(prev => ({
                ...prev,
                birth_date: birthDate,
                age: resData?.age
            }));
        } catch (error) {
            console.log('Error fetching to update user birth date: ', error);
            setMessage('Error');
        }

        setLoading(false);
    }

    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];
    const minDateObj = new Date();
    minDateObj.setFullYear(today.getFullYear() - 150);
    const minDate = minDateObj.toISOString().split("T")[0];

    return (
        <div className="BirthDateUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentAge" className='components-label'>Current age:</label>
                <p className='components-data'>{user.age  ? user.age : "undefined"}</p>
                <label htmlFor="currentBirthDate" className='components-label'>Current birth date:</label>
                <p className='components-data'>{user.birth_date  ? user.birth_date : "undefined"}</p>
                <label htmlFor="BirthDateUpdateInput" className="components-label">Your new birth date:</label>
                <input type="date" className="components-date" 
                onChange={(e) => {
                    const date = new Date(e.target.value); 
                    setBirthDate(date.toISOString().split("T")[0]) 
                }} 
                name="newBirthDate" id="BirthDateUpdateInput" max={maxDate} min={minDate} />

                <button type="submit" className="components-btn-submit">Update birth date</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
            </form>
        </div>
    );
}