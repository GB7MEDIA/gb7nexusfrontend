import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { validEmailRegex, validPhonenumberRegex, validPasswordRegex } from "../../helpers/regex";

import { registerAPI } from "../../axios/auth";

import "../../css/general.css";
import "../../css/form.css";

export const RegisterScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const location = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setTenantId(queryParams.get('tenantId'));
    }, [location.search]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name) {
            setError('The name can not be left empty!');
            return;
        }

        if (!email) {
            setError('The email can not be left empty!');
            return;
        }

        if(!validEmailRegex.test(email)) {
            setError('The email has to be valid!');
            return;
        }

        if (!phonenumber) {
            setError('The phonenumber can not be left empty!')
            return;
        }

        if (!validPhonenumberRegex.test(phonenumber)) {
            setError('The phonenumber has to be valid!');
            return;
        }

        if (!password) {
            setError('The password can not be left empty!');
            return;
        }

        if (!validPasswordRegex.test(password)) {
            setError('The password has to have at lease one letter and number and at least 8 characters!');
            return;
        }

        if (password !== repeatPassword) {
            setError('The passwords do not match!');
            return;
        }

        const response = await registerAPI(name, email, phonenumber, tenantId, password);
        if (response.success === true) {
            navigate("/login");
        } else {
            setError(response.error.error);
        }
    };

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Name ..." 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Email ..." 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Phonenumber ..." 
                    value={phonenumber} 
                    onChange={(e) => setPhonenumber(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password ..." 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Repeat Password ..." 
                    value={repeatPassword} 
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <input
                    type="submit"
                    value="Register"
                />
                {error && (<p>{error}</p>)}
                <Link
                    to="/login"
                >Already have an account? Login instead!</Link>
            </form>
        </>
    );
};

