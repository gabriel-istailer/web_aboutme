'use client';

import './page.css';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function finishEmailUpdate() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function verifyToken() {
            setLoading(true);
            if(!token) {
                setMessage('Token not provided');
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/users/update/email/finish?token=${token}`);
                const resData = await res.json();
                if(resData.status === 201) {
                    localStorage.setItem('userToken', JSON.stringify(resData.token));
                }
                setMessage(resData.message);
            } catch (error) {
                console.log('Error fetching to complete user email update: ', error);
                setMessage('Client Error');
                setLoading(false);
                return;
            }
            setLoading(false);
        }
        verifyToken();
    }, [token]);

    return (
        <div className="finishEmailUpdate flex-center flex-column">
            <div className="finishEmailUpdate-display-message flex-center flex-column smooth-animation">
                <h1 className="finishEmailUpdate-title">Completing the email update</h1>
                <p className="finishEmailUpdate-message">{message}</p>
                <p className="finishEmailUpdate-loading" style={loading ? {display: "flex"} : {display: "none"}}>Loading...</p>
            </div>
        </div>
    );
}