import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { activateAccountAPI } from "../../axios/auth";

import "../../css/general.css";

export const ActivateAccountScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activationStatus, setActivationStatus] = useState('');
    const [userId, setUserId] = useState('');
    const [activationCode, setActivationCode] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userIdParam = queryParams.get('userId');
        const activationCodeParam = queryParams.get('code');

        if (userIdParam && activationCodeParam) {
            setUserId(userIdParam);
            setActivationCode(activationCodeParam);
        } else {
            setActivationStatus('Fehler: Die Nutzer Id oder der Aktivierungscode ist nicht vorhanden! Bitte überprüfen Sie den Link.');
        }
    }, [location.search]);

    useEffect(() => {
        if (userId && activationCode) {
            (async () => {
                try {
                    setActivationStatus('Activation is in progress ...');

                    const response = await activateAccountAPI(userId, activationCode);
                    if (response.success === true) {
                        navigate('/login');
                    }
                } catch (error) {
                    setActivationStatus('Fehler: Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'); 
                }
            })();
        }
    }, [userId, activationCode, navigate]);

    return (
        <>
            <h1>Konto aktivieren</h1>
            <p>Status: {activationStatus}</p>
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


