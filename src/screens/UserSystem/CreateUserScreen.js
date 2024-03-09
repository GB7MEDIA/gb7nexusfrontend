import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validEmailRegex, validPhonenumberRegex, validPasswordRegex } from "../../helpers/regex";
import { getAllTenantsAPI } from "../../axios/tenant";
import { createUserAPI } from "../../axios/user";

import "../../css/general.css";
import "../../css/form.css";

export const CreateUserScreen = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phonenumber: '',
        role: 'user',
        tenantId: '',
        password: '',
        repeatPassword: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
        else if (!isAdmin) navigate("/");
        else fetchTenants();
    }, [isLoggedIn, isAdmin, navigate]);

    const fetchTenants = async () => {
        try {
            const { data } = await getAllTenantsAPI();
            setTenants(data.data.tenants);
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, email, phonenumber, password, repeatPassword, role } = formData;
        if (!name || !email || !phonenumber || !role || !password) return 'Please fill in all fields';
        if (!validEmailRegex.test(email)) return 'Invalid email format';
        if (!validPhonenumberRegex.test(phonenumber)) return 'Invalid phonenumber format';
        if (!validPasswordRegex.test(password)) return 'Password must contain at least one letter, one number, and be at least 8 characters long';
        if (password !== repeatPassword) return 'Passwords do not match';
        return '';
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await createUserAPI({
                name: formData.name,
                email: formData.email,
                phonenumber: formData.phonenumber,
                role: formData.role,
                tenantId: formData.tenantId,
                password: formData.password,
            });
            navigate('/users');
        } catch (error) {
            setError("Failed to create user. Please try again.");
            console.error("Create user error:", error);
        }
    };

    return (
        <>
            <h1>Create User</h1>
            <form onSubmit={handleCreateUser}>
                <input type="text" name="name" placeholder="Name ..." value={formData.name} onChange={handleChange} />
                <input type="text" name="email" placeholder="Email ..." value={formData.email} onChange={handleChange} />
                <input type="text" name="phonenumber" placeholder="Phonenumber ..." value={formData.phonenumber} onChange={handleChange} />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <select name="tenantId" value={formData.tenantId} onChange={handleChange}>
                    <option value="">Select Tenant</option>
                    {tenants.map(tenant => (
                        <option key={tenant._id} value={tenant._id}>{tenant.companyname}</option>
                    ))}
                </select>
                <input type="password" name="password" placeholder="Password ..." value={formData.password} onChange={handleChange} />
                <input type="password" name="repeatPassword" placeholder="Repeat Password ..." value={formData.repeatPassword} onChange={handleChange} />
                <input type="submit" value="Create" />
                {error && <p>{error}</p>}
            </form>
        </>
    );
};

