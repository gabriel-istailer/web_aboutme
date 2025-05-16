'use client';

import './layout.css';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function Account() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if(!userToken) {
            setUser(false);
            setLoading(false);
            return;
        }
        const fetchGetUser = async () => {
            try {
                const res = await fetch(`/api/users/get?token=${userToken}`);
                const resData = await res.json();
                setUser(resData.user);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching the user from the server: ', error);
            }
        };
        fetchGetUser();
    }, []);

    if(loading) {
        return <h1>Carregando...</h1>;
    }

    return (
        <div className="Account">
            <h1>{user.name}</h1>
        </div>
    );
}