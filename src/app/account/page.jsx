'use client';

import './layout.css';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function Account() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        console.log(userToken);
        if(!userToken) {
            setUser(false);
            return;
        }
        const fetchGetUser = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/users/get?token=${userToken}`);
                const resData = await res.json();
                setUser(resData.user);
                setLoading(false);
                console.log(user);
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
        </div>
    );
}