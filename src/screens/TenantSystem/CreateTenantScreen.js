import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createTenantAPI } from "../../axios/tenant";
import { getAllObjectsAPI } from "../../axios/object";

import "../../css/general.css";
import "../../css/form.css";

export const CreateTenantScreen = ({ isLoggedIn, isAdmin, currentUserId, currentUser }) => {
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

    const [objects, setObjects] = useState([]);
    const [companyname, setCompanyname] = useState('');
    const [objectId, setObjectId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const objectsData = await getAllObjectsAPI();
                setObjects(objectsData.data.data.objects);
            } catch (error) {
                console.error('Failed to fetch objects:', error);
                setError('Failed to load objects. Please try again later.');
            }
        })();
    }, []);

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        if (!companyname) {
            setError('The companyname can not be left empty!');
            return;
        }

        if (!objectId) {
            setError('The object id can not be left empty!');
        }

        try {
            const response = await createTenantAPI(companyname, objectId);
            console.log(response);
            navigate('/tenants');
        } catch (error) {
            console.error('Failed to create tenant:', error);
            setError('Failed to create tenant. Please try again.');
        }
    };

    return (
        <>
            <h1>Create Tenant</h1>
            <form 
                onSubmit={handleCreateTenant}
            >
                <input
                    type="text"
                    placeholder="Companyname ..."
                    value={companyname}
                    onChange={(e) => setCompanyname(e.target.value)}
                /><br />
                <select
                    value={objectId}
                    onChange={(e) => setObjectId(e.target.value)}
                >
                    <option value="">Select Object</option>
                    {objects.length > 0 ? (
                        objects.map((object) => (
                            <option key={object._id} value={object._id}>{object.objectname}</option>
                        ))
                    ) : (<option disabled>No Objects available</option>)}
                </select><br />
                <input
                    type="submit"
                    value="Create"
                />
                {error && (<p style={{ color: 'red' }}>{error}</p>)}
            </form>
        </>
    );
};

