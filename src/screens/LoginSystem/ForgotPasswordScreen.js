import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { validEmailRegex } from "../../helpers/regex";

import { forgotPasswordAPI } from "../../axios/auth";

import "../../css/general.css";
import "../../css/form.css";

export const ForgotPasswordScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('The email can not be left empty!');
            return;
        }

        if(!validEmailRegex.test(email)) {
            setError('The email has to be valid!');
            return;
        }

        const response = await forgotPasswordAPI(email);
        if (response.success === true) {
            navigate("/login");
        } else {
            setError(response.error.error);
        }
    };

    return (
        <>
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <input 
                    type="text" 
                    placeholder="Email ..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="submit"
                    value="Forgot Password"
                />
                {error && (<p>{error}</p>)}
                <Link to="/login">Go back to login!</Link>
            </form>
        </>
    );
};
