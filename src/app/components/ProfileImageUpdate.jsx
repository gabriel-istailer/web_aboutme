'use client';

import { useState } from "react";

import './ProfileImageUpdate.css';

export default function ProfileImageUpdate({ user }) {

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileUserProfile, setFileUserProfile] = useState(null);
    const [previewUserProfile, setPreviewUserProfile] = useState(user?.profile_image_path);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {

            const formData = new FormData();
            formData.append('email', user?.email);
            formData.append('file', fileUserProfile);

            const res = await fetch('/api/users/update/profile-image', {
                method: 'PATCH',
                body: formData
            });
            const resData = await res.json();
            console.log(resData?.message);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching to update profile picture: ', error);
            setMessage('Client Error');
            setLoading(false);
            return false;
        }

    }

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        if(selectedFile) {
            setFileUserProfile(selectedFile);
            setPreviewUserProfile(URL.createObjectURL(selectedFile));
        }
    }

    return (
        <div className="ProfileImageUpdate flex-center flex-column">
            <img src={previewUserProfile} alt="user_profile" width='300px' height='300px' className="profileImageUpdate-user-profile-img" />
            <p>300x300</p>
            <form onSubmit={handleSubmit} className="profileImageUpdate-form flex-center flex-column">
                <input type="file" accept="image/*" onChange={handleFileChange} className="profileImageUpdate-input-file" name="profile_user" id="inputUserProfileImage" />
                <label htmlFor="inputUserProfileImage" className="profileImageUpdate-label-file">Escolher Imagem</label>
                <p className="profileImageUpdate-file-display"></p>
                <button type="submit" className="profileImageUpdate-submit">Update Profile Image</button>
            </form>
            <p style={loading ? { display: 'flex' } : { display: 'none' }}>Loading...</p>
            <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
        </div>
    );
}