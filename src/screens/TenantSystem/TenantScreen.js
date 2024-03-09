import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getAllTenantsAPI } from "../../axios/tenant";

import "../../css/general.css";
import "../../css/table.css";

export const TenantsScreen = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const result = await getAllTenantsAPI();
                setTenants(result.data.data.tenants);
            } catch (error) {
                console.error("Failed to fetch tenants:", error);
            }
        })();
    }, []);

    return (
        <>
            <h1>Tenants:</h1>
            {tenants.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Companyname</th>
                                <th>Object</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td>{tenant.companyname}</td>
                                    <td>
                                        <Link
                                            to={`/objects/${tenant.object.id}`}
                                        >
                                        {tenant.object.objectname}
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/tenants/${tenant.id}`)}
                                        >Show Tenant</button>
                                        <button
                                            onClick={() => navigate(`/tenants/${tenant.id}/edit`)}
                                        >Edit Tenant</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>There are no tenants to show ...</p>)}
        </>
    );
};

