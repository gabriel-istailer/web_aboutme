'use client';

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
                setMessage(resData.message);

            } catch (error) {
                console.log('Error fetching to complete user email update: ', error);
                setMessage('Client Error');
                setLoading(false);
                return;
            }
        }
    }, [token]);

    return (
        <div className="finishEmailUpdate">

        </div>
    );
}