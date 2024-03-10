import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { getTenantByIdAPI, getTenantUsersByTenantIdAPI } from "../../axios/tenant";

import "../../css/general.css";

export const TenantDetailScreen = ({ isLoggedIn, isAdmin, currentUserId }) => {
    const navigate = useNavigate();
    const { tenantId } = useParams();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [tenant, setTenant] = useState([]);
    const [tenantUsers, setTenantUsers] = useState([]);

    useEffect(() => {
        (async () => {
            if (tenantId) {
                const tenantData = await getTenantByIdAPI(tenantId);
                setTenant(tenantData.data.data.tenant);
                const usersData = await getTenantUsersByTenantIdAPI(tenantId);
                const filteredUsers = usersData.data.data.users.filter(user => user !== null);
                setTenantUsers(filteredUsers);
            }
        })()
    }, [tenantId]);

    return (
        <>
            <h1>{tenant.companyname}</h1>
            {isAdmin &&(<button
                            onClick={() => navigate(`/tenants/${tenantId}/edit`)}
                            style={{
                                marginRight: '10px',
                                backgroundColor: '#333',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                        >Edit Tenant</button>)}
            {tenant.object && (<p>Object: {tenant.object.objectname}</p>)}
            {tenantUsers && tenantUsers.length > 0 ? (
            <>
                <h3>Tenant Users:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phonenumber</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tenantUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phonenumber}</td>
                            <td>
                                {!isAdmin && (currentUserId === user._id) (<button onClick={() => navigate(`/settings`)}>Settings</button>)}
                                {isAdmin && (<button onClick={() => navigate(`/users/${user._id}/edit`)}>Edit User</button>)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>
            ) : (
                <p>No users available.</p>
            )}
        </>
    );
};
