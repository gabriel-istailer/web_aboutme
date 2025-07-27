'use client';

import '../../layout.css';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinishSignUp() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Completing registration...');

    useEffect(() => {
        async function verifyToken() {
            setLoading(true);
            if(!token) {
                setMessage('Token not provided');
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/users/signup/finish?token=${token}`);
                const resData = await res.json();
                setMessage(resData.message);
                console.log(resData);
                if(resData.token) {
                    localStorage.setItem('userToken', JSON.stringify(resData.token));
                    router.push('/');
                }
            } catch (error) {
                console.log('Error in fetch to complete registration: ', error);
                setMessage('Client Error');
                setLoading(false);
                return;
            }
            setLoading(false);
        }
        verifyToken();
    }, [token])

    return (
        <div className="finishSignUp">
            <div className="formLayout-form flex-center flex-column">
                <h1 className="formLayout-title text-center">Sign Up</h1>
                <Link className='formLayout-button text-center' onClick={() => {setLoading(true)}} href='/'>Página inicial</Link>
                <p className="formLayout-advice text-center">{message}</p>
                <p className="formLayout-loading text-center" style={loading ? {display: 'block'} : {display: 'none'}} >Loading...</p>
            </div>
        </div>
    );
}