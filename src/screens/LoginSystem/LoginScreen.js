import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { validEmailRegex, validPasswordRegex } from "../../helpers/regex";

import { loginAPI } from "../../axios/auth";

import "../../css/general.css";
import "../../css/form.css";

export const LoginScreen = ({ isLoggedIn, setIsLoggedIn, setIsAdmin }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('The email can not be left empty!');
            return;
        }

        if(!validEmailRegex.test(email)) {
            setError('The email has to be valid!');
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

        const response = await loginAPI(email, password);
        if (response.success === true) {
            localStorage.setItem('token', response.data.response.data.data.token);
            setIsLoggedIn(true);
            setIsAdmin(response.data.response.data.data.user.role === "admin" ? true : false);
            navigate('/');
        } else {
            setError(response.error.error);
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Email ..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password ..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="submit"
                    value="Login"
                />
                {error && (<p>{error}</p>)}
                <Link
                    to="/password/forgot"
                >Forgot Password?</Link>
                <Link
                    to="/register"
                >Do not have an account? Register instead!</Link>
            </form>
        </>
    );
};

