'use client';

import './components.css';

import { useEffect, useState } from 'react';

export default function HobbiesUpdate({ user }) {

    const [hobby, setHobby] = useState('');
    const [hobbies, setHobbies] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(!user.hobbies) {
            return;
        }
        setHobbies(user.hobbies.split(', '));
    }, [user]);

    async function hobbyValidations() {

        setLoading(true);

        if(hobbies) {
            if(hobbies.length >= 3) {
                setMessage('Only 3 hobbies are allowed');
                setLoading(false);
                return false;
            } else if(hobbies.includes(hobby)) {
                setMessage('This hobby has already been added');
                setLoading(false);
                return false;
            }
        }

        if(hobby.includes(',')) {
            setMessage('Hobby cannot contain commas');
            setLoading(false);
            return false;
        }

        if(hobby.trim().length < 3 || hobby.trim().length > 50) {
            setMessage('The hobby must contain between 3 and 50 characters');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!await hobbyValidations()) {
            return;
        }

        setLoading(true);

        const updatedHobbies = hobbies ? [...hobbies, hobby] : [hobby];

        setHobbies(updatedHobbies);

        try {
            const res = await fetch('/api/users/update/hobbies', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({hobbies: updatedHobbies.join(', '), email: user.email})
            });
            const resData = await res.json();
            if(resData.status === '201') {
                setMessage(resData.message);
            }
        } catch (error) {
            console.log('Error fetching to update hobbies: ', error);
            setMessage('Error');
        }

        document.getElementById('hobbyAddInput').value = '';

        setLoading(false);
    }

    async function handleDeleteHobby(deletedHobby) {
        setLoading(true);

        const updatedHobbies = hobbies.filter(h => h !== deletedHobby);

        setHobbies(updatedHobbies);

        try {
            const res = await fetch('/api/users/update/hobbies', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({hobbies: updatedHobbies.join(', '), email: user.email})
            });
            const resData = await res.json();
            if(resData.status === '201') {
                setMessage(resData.message);
            }
        } catch (error) {
            console.log('Error fetching to update hobbies: ', error);
            setMessage('Error');
        }

        setLoading(false);
    }

    return (
        <div className="HobbiesUpdate">
            <form onSubmit={handleSubmit} className="flex-center flex-column">
                <label htmlFor="currentEmail" className='components-label'>Current hobbies:</label>
                {hobbies && hobbies.length > 0 ? hobbies.map(currentHobby => (
                    <div key={currentHobby} className='components-object-data flex'>
                        <p>{currentHobby}</p>
                        <button className='components-btn-delete' onClick={() => handleDeleteHobby(currentHobby)}>Remover</button>
                    </div>
                )) : <p className='components-data'>undefined</p>}
                <label htmlFor="hobbyAddInput" className="components-label">Your new hobby:</label>
                <input type="text" className="components-input" onChange={(e) => { setHobby(e.target.value) }} name="newHobby" id="hobbyAddInput" />
                <button type="submit" className="components-btn-submit">Add hobby</button>
                <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
                <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
            </form>
        </div>
    );
}