'use client';

import { useState } from "react";

import './components.css';
import './ProfileImageUpdate.css';

export default function ProfileImageUpdate({ user, setUser }) {

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
            setMessage(resData?.message)
            setUser(prev => ({
                ...prev,
                profile_image_path: resData?.profile_image_path
            }));
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

    async function handleSetDefaultProfileImage() {
        try {
            const res = await fetch('/users-profiles/default-profile.jpg');
            const blob = await res.blob();
            const file = new File(
                [blob],
                'default-profile.jpg',
                {
                    type: blob.type,
                    lastModified: Date.now(),
                }
            );

            setFileUserProfile(file);
            setPreviewUserProfile(URL.createObjectURL(file));
        } catch (error) {
            console.log('Error fetching the default image from the server: ', error);
        }
    }

    return (
        <div className="ProfileImageUpdate flex-center flex-column">
            <img src={previewUserProfile} alt="user_profile" width='300px' height='300px' className="profileImageUpdate-user-profile-img" />
            <p>300x300</p>
            <form onSubmit={handleSubmit} className="profileImageUpdate-form flex-center flex-column">
                <input type="file" accept="image/*" onChange={handleFileChange} className="profileImageUpdate-input-file" name="file" id="inputUserProfileImage" />
                <button type="button" onClick={handleSetDefaultProfileImage} className="profileImageUpdate-default-profile-btn">Use default image?</button>
                <label htmlFor="inputUserProfileImage" className="profileImageUpdate-label-file">Escolher Imagem</label>
                <button type="submit" className="components-btn-submit">Save Profile Image</button>
            </form>
            <p style={message ? { display: 'flex' } : { display: 'none' }} className="account-update-message">{message}</p>
            <p style={loading ? { display: 'flex' } : { display: 'none' }} className="account-update-loading">Loading...</p>
        </div>
    );
}