'use client';

import { useState } from "react";

import './ProfileImageUpdate.css';

export default function ProfileImageUpdate({ user }) {

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileUserProfile, setFileUserProfile] = useState(null);

    async function handleSubmit(e) {
        
    }

    return (
        <div className="ProfileImageUpdate flex-center flex-column">
            <img src={user?.profile_image_path} alt="user_profile" width='300px' className="profileImageUpdate-user-profile-img" />
            <p>500x500</p>
            <form onSubmit={handleSubmit} className="profileImageUpdate-form flex-center flex-column">
                <input type="file" accept="image/*" onChange={e => { setFileUserProfile(e.target.value) }} className="profileImageUpdate-input-file" name="profile_user" id="inputUserProfileImage" />
                <label htmlFor="inputUserProfileImage" className="profileImageUpdate-label-file">Escolher Imagem</label>
                <p className="profileImageUpdate-file-display"></p>
                <button type="submit" className="profileImageUpdate-submit">Update Profile Image</button>
            </form>
        </div>
    );
}