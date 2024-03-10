import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { validEmailRegex, validPhonenumberRegex } from "../../helpers/regex";
import { getUserByIdAPI, editUserByIdAPI } from "../../axios/user";
import { getAllTenantsAPI, getTenantByUserIdAPI } from "../../axios/tenant";

import "../../css/general.css";
import "../../css/form.css";

export const EditUserScreen = ({ isLoggedIn, isAdmin, currentUserId }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phonenumber: '',
        role: 'user',
        tenantId: '',
        twoFactorAuthType: 'false',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) navigate("/login");
        else if (!isAdmin || userId === currentUserId) navigate(userId === currentUserId ? '/settings' : '/');
    }, [isLoggedIn, isAdmin, userId, currentUserId, navigate]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const tenantsResponse = await getAllTenantsAPI();
                setTenants(tenantsResponse.data.data.tenants);

                const tenantData = await getTenantByUserIdAPI(userId);
                const tenantId = tenantData.data.data.tenantId.tenantId;

                const userResponse = await getUserByIdAPI(userId);
                const user = userResponse.data.data.user;
                setUserDetails({
                    name: user.name,
                    email: user.email,
                    phonenumber: user.phonenumber,
                    role: user.role,
                    tenantId: tenantId,
                    twoFactorAuthType: user.tfaSetting,
                });
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchInitialData();
    }, [userId]);

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, email, phonenumber, role, twoFactorAuthType } = userDetails;
        if (!name || !email || !phonenumber || !role || !twoFactorAuthType) return 'All fields must be filled!';
        if (!validEmailRegex.test(email)) return 'Invalid email format!';
        if (!validPhonenumberRegex.test(phonenumber)) return 'Invalid phonenumber format!';
        if (!['user', 'admin'].includes(role)) return 'Invalid role!';
        if (!['false', 'email', 'sms'].includes(twoFactorAuthType)) return 'Invalid two factor authentication type!';
        return '';
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await editUserByIdAPI(userId, userDetails.name, userDetails.email, userDetails.phonenumber, userDetails.twoFactorAuthType, userDetails.role);
            if (response) {
                navigate('/users');
            }
        } catch (error) {
            setError('Failed to update user.');
            console.error("Update user error:", error);
        }
    };

    return (
        <>
            <h1>Edit User</h1>
            <form onSubmit={handleEditUser}>
                {Object.entries(userDetails).map(([key, value]) => key !== 'tenantId' && key !== 'twoFactorAuthType' && key !== 'role' && (
                    <input key={key} name={key} type="text" placeholder={`${key[0].toUpperCase() + key.slice(1)} ...`} value={value} onChange={handleChange} />
                ))}
                <select name="role" value={userDetails.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <select name="tenantId" value={userDetails.tenantId} onChange={handleChange}>
                    <option value="">No Tenant</option>
                    {tenants.map(tenant => (
                        <option key={tenant.id} value={tenant.id}>{tenant.companyname}</option>
                    ))}
                </select>
                <select name="twoFactorAuthType" value={userDetails.twoFactorAuthType} onChange={handleChange}>
                    <option value="false">No Two Factor Authentication</option>
                    <option value="email">Email Two Factor Authentication</option>
                    <option value="sms">SMS Two Factor Authentication</option>
                </select>
                <input type="submit" value="Save" />
                {error && <p>{error}</p>}
            </form>
        </>
    );
};

