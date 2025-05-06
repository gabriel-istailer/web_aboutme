'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function finishSignUp() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [message, setMessage] = useState('Verifying email...');

    useEffect(() => {
        async function verifyToken() {
            if(!token) {
                setMessage('Token não fornecido');
                return;
            }
            try {
                const res = await fetch(`/api/users/signup/finish?token=${token}`);
                const resData = await res.json();
                setMessage(resData.message);
            } catch (error) {
                setMessage('Error');
                console.log('Error in fetch to complete registrationL ', error);
                return;
            }
        }
        verifyToken();
    }, [token])

    return (
        <div className="finishSignUp">

        </div>
    );
}