'use client';

import './page.css';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function verifyId() {
            setLoading(true);
            if(!id) {
                setMessage('Id not provided');
                setLoading(false);
                router.push('/');
                return;
            }
            try {
                const res = await fetch(`/api/users/get?id=${id}`);
                const resData = await res.json();
                if(!resData.user) {
                    setLoading(false);
                    router.push('/');
                }
                setUser(resData.user);
            } catch (error) {
                console.log('Error in fetch to complete registration: ', error);
                setMessage('Error');
                setLoading(false);
                return;
            }
            setLoading(false);
        }
        verifyId();
    }, [id])

    return (
        <div className="Profile">
            <h1>{user?.name}</h1>
        </div>
    );
}