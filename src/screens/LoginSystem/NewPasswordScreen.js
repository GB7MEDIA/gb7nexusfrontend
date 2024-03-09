import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { validPasswordRegex } from "../../helpers/regex";

import { newPasswordAPI } from "../../axios/auth";

import "../../css/general.css";
import "../../css/form.css";

export const NewPasswordScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const [userId, setUserId] = useState('');
    const [newPasswordCode, setNewPasswordCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userIdParam = queryParams.get('userId');
        const newPasswordCode = queryParams.get('code');

        if (userIdParam && newPasswordCode) {
            setUserId(userIdParam);
            setNewPasswordCode(newPasswordCode);
        }
    }, [location.search]);
    
    const [error, setError] = useState('');

    const handleNewPassword = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('The user id can not be left empty!');
            return;
        }

        if (!newPasswordCode) {
            setError('The new password code can not be left empty!');
            return;
        }

        if (!newPassword) {
            setError('The password can not be left empty!');
            return;
        }

        if (!validPasswordRegex.test(newPassword)) {
            setError('The password has to have at lease one letter and number and at least 8 characters!');
            return;
        }

        if (newPassword !== repeatNewPassword) {
            setError('The passwords do not match!');
            return;
        }

        const response = await newPasswordAPI(userId, newPasswordCode, newPassword);
        if (response.success === true) {
            navigate("/login");
        } else {
            setError(response.error.error);
        }
    };

    return (
        <>
            <h1>New Password</h1>
            <form onSubmit={handleNewPassword}>
                <input 
                    type="password" 
                    placeholder="New Password ..." 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Repeat New Password ..."
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
                <input
                    type="submit"
                    value="Save"
                />
                {error && (<p>{error}</p>)}
                <Link
                    to="/login"
                >Go back to login!</Link>
            </form>
        </>
    );
};

