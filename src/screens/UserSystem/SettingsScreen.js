import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { validEmailRegex, validPhonenumberRegex } from "../../helpers/regex";
import { editUserByIdAPI } from "../../axios/user";

import "../../css/general.css";
import "../../css/form.css";

export const SettingsScreen = ({ isLoggedIn, currentUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phonenumber: '',
        twoFactorAuthType: 'false',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            const { name, email, phonenumber, tfaSetting } = currentUser;
            setFormData({ name, email, phonenumber, twoFactorAuthType: tfaSetting });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phonenumber, twoFactorAuthType } = formData;

        setError('');
        if (!name || !email || !phonenumber || !twoFactorAuthType) {
            setError('All fields are required.');
            return;
        }
        if (!validEmailRegex.test(email)) {
            setError('The email must be valid.');
            return;
        }
        if (!validPhonenumberRegex.test(phonenumber)) {
            setError('The phonenumber must be valid.');
            return;
        }
        if (!["false", "email", "sms"].includes(twoFactorAuthType)) {
            setError('The two-factor authentication type is invalid.');
            return;
        }

        try {
            const response = await editUserByIdAPI(currentUser.id, name, email, phonenumber, twoFactorAuthType);
            console.log(response);
        } catch (error) {
            setError('Failed to update settings.');
            console.error(error);
        }
    };

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Settings</h1>
            <form
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name ..."
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email ..."
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="phonenumber"
                    placeholder="Phonenumber ..."
                    value={formData.phonenumber}
                    onChange={handleChange}
                />
                <select
                    name="twoFactorAuthType"
                    value={formData.twoFactorAuthType}
                    onChange={handleChange}
                >
                    <option value="false">No Two Factor Authentication</option>
                    <option value="email">Email Two Factor Authentication</option>
                    <option value="sms">SMS Two Factor Authentication</option>
                </select>
                <input
                    type="submit"
                    value="Save"
                />
                {error && (<p>{error}</p>)}
            </form>
        </>
    );
};


