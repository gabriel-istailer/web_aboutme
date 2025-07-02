'use client';

import '../layout.css';
import './page.css';

export default function UpdateAccount() {
    return (
        <div className='UpdateAccount'>
            <main className='account-update-main flex-center'>
                <form className="account-update-main-form flex-center flex-column">
                    <h1 className="account-update-main-form-title">Update your account</h1>
                    <label className='account-update-main-form-label' htmlFor="selectUserDataOptions">Select the account information you want to change:</label>
                    <select className='account-update-main-form-select' name="selectUserDataOptions" id="selectUserDataOptions">
                        <option className='account-update-main-form-option' value="name">Name</option>
                        <option className='account-update-main-form-option' value="email">Email</option>
                        <option className='account-update-main-form-option' value="gender">Gender</option>
                        <option className='account-update-main-form-option' value="birth_date">Date of Birth</option>
                        <option className='account-update-main-form-option' value="profession">Profession</option>
                        <option className='account-update-main-form-option' value="hobbies">Hobbies</option>
                        <option className='account-update-main-form-option' value="biography">Biography</option>
                    </select>
                </form>
            </main>
        </div>
    );
}