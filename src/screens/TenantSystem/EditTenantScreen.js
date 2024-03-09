import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { editTenantByIdAPI, getTenantByIdAPI } from "../../axios/tenant";
import { getAllObjectsAPI } from "../../axios/object";

import "../../css/general.css";
import "../../css/form.css";

export const EditTenantScreen = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    const { tenantId } = useParams();

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

    useEffect(() => {
        (async () => {
            if (tenantId) {
                const tenantData = await getTenantByIdAPI(tenantId);
                setCompanyname(tenantData.data.data.tenant.companyname);
                setObjectId(tenantData.data.data.tenant.objectId);
            }
        })()
    }, [tenantId, setCompanyname, setObjectId]);

    const handleEditTenant = async(e) => {
        e.preventDefault();

        if (!companyname) {
            setError('The companyname can not be left empty!');
            return;
        }

        if (!objectId) {
            setError('The object id can not be left empty!');
            return;
        }

        const response = await editTenantByIdAPI(tenantId, companyname, objectId);
        console.log(response);
    };

    return (
        <>
            <h1>Edit Tenant</h1>
            <form onSubmit={handleEditTenant}>
                <input 
                    type="text" 
                    placeholder="Companyname ..." 
                    value={companyname} 
                    onChange={(e) => setCompanyname(e.target.value)}
                /><br />
                <select value={objectId} onChange={(e) => setObjectId(e.target.value)}>
                    <option value="">Select Object</option>
                    {objects.length > 0 ? (
                        objects.map((object) => (
                            <option key={object._id} value={object._id}>{object.objectname}</option>
                        ))
                    ) : (<option disabled>No Objects available</option>)}
                </select><br />
                <input
                    type="submit"
                    value="Save"
                />
                {error && (<p>{error}</p>)}
            </form>
        </>
    );
};
