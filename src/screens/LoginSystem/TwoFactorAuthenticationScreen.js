import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { tfaAPI } from "../../axios/auth";

import "../../css/general.css";

export const TwoFactorAuthenticationScreen = ({ isLoggedIn, setIsLoggedIn}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [tfaStatus, setTfaStatus] = useState('');
    const [userId, setUserId] = useState('');
    const [tfaCode, setTfaCode] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userIdParam = queryParams.get('userId');
        const tfaCodeParam = queryParams.get('code');

        if (userIdParam && tfaCodeParam) {
            setUserId(userIdParam);
            setTfaCode(tfaCodeParam);
        } else {
            setTfaStatus('The user Id or the two factor authentication code is missing!');
        }
    }, [location.search]);

    useEffect(() => {
        if (userId && tfaCode) {
            (async () => {
                try {
                    setTfaStatus('Two Factor Authentication is in progress ...');

                    const response = await tfaAPI(userId, tfaCode);
                    if (response.success === true) {
                        localStorage.setItem('token', response.data.response.data.data.token);
                        setIsLoggedIn(true);
                        navigate('/');
                    }
                } catch (error) {
                    setTfaStatus('Fehler: Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'); 
                }
            })();
        }
    }, [userId, tfaCode, isLoggedIn, setIsLoggedIn, navigate]);

    return (
        <>
            <h1>Zwei-Faktor-Authentisierung:</h1>
            <p>Status: {tfaStatus}</p>
            <Link
                to="/login"
                style={{
                    marginRight: '10px',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                }}
            >Go back to login!</Link>
        </>
    );
};


