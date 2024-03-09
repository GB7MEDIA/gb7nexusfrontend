import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getObjectByIdAPI, getObjectAdressesByObjectIdAPI, createObjectAdressesByObjectIdAPI, editObjectAdressByIdAPI, deleteObjectByIdAPI, deleteObjectAdressByIdAPI } from "../../axios/object";
import { getAllTenantsAPI } from "../../axios/tenant";

import "../../css/general.css";
import "../../css/form.css";

export const ObjectDetailScreen = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const { objectId } = useParams();

    const [object, setObject] = useState([]);
    const [objectAdresses, setObjectAdresses] = useState([]);
    const [editState, setEditState] = useState(false);
    const [adressId, setAdressId] = useState('');
    const [adress, setAdress] = useState('');
    const [floors, setFloors] = useState('');
    const [error, setError] = useState('');
    const [tenants, setTenants] = useState([]);
    useEffect(() => {
        (async () => {
            if (objectId) {
                try {
                    const objectData = await getObjectByIdAPI(objectId);
                    setObject(objectData.data.data.object);
                    const objectAdressesData = await getObjectAdressesByObjectIdAPI(objectId);

                    let adresses = objectAdressesData.data.data.adresses;
                    if (!Array.isArray(adresses)) {
                        adresses = [adresses];
                    }
                    setObjectAdresses(adresses);
                } catch (error) {
                    console.error("Failed to fetch object data:", error);
                }
            }
        })();
    }, [objectId]);

    useEffect(() => {
        (async () => {
            if (isAdmin) {
                const tenantsData = await getAllTenantsAPI();
                if (objectId) {
                    setTenants(tenantsData.data.data.tenants.filter(tenant => tenant.object.id === objectId));
                }
            }
        })()
    }, [isAdmin, objectId]);

    const handleCreateAdress = async (e) => {
        e.preventDefault();

        if (!adress) {
            setError('The adress can not be left empty!');
            return;
        }

        if (!floors) {
            setError('The floors can not be left empty!');
            return;
        }

        const floorsArray = floors.split(",");

        const response = await createObjectAdressesByObjectIdAPI(objectId, adress, floorsArray);
        console.log(response);
    }

    const handleEditClick = (adressId, adress, floors) => {
        setEditState(true);
        setAdressId(adressId);
        setAdress(adress);
        setFloors(floors);
    }

    const handleEditAdress = async (e) => {
        e.preventDefault();

        if (!adress) {
            setError('The adress can not be left empty!');
            return;
        }

        if (!floors) {
            setError('The floors can not be left empty!');
            return;
        }

        const response = await editObjectAdressByIdAPI(adressId, adress, floors);
        console.log(response);
    }

    const handleDeleteObject = async (objectId) => {
        const response = await deleteObjectByIdAPI(objectId);
        if (response) {
            navigate(`/objects`);
        }
    }

    const handleDeleteAdress = async (adressId) => {
        const response = await deleteObjectAdressByIdAPI(adressId);
        console.log(response);
    }

    return (
        <>
            <h1>{object.objectname}</h1>
            {isAdmin && (<button
                onClick={ () => navigate(`/objects/${objectId}/edit`) }
                style={{
                    marginRight: '10px',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                }}
                >Edit Object</button>)}
            {isAdmin && (<button
                onClick={ () => handleDeleteObject(objectId) }
                style={{
                    marginRight: '10px',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                }}
                >delete</button>)}
            <h2>Object Adresses</h2>
            <table
                style={{
                    width: '100%',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    borderCollapse: 'collapse',
                    marginTop: '20px',
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px 20px' }}>Address</th>
                        {isAdmin && <th style={{ textAlign: 'right', padding: '10px 20px' }}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                {objectAdresses.length > 0 ? (
                    objectAdresses.map((adress) => (
                        <tr key={adress._id} style={{ backgroundColor: '#ffffff', color: '#333', borderBottom: '1px solid #333' }}>
                            <td style={{ textAlign: 'left', padding: '10px 10px' }}>{adress.adress || 'Address not available'}</td>
                            {isAdmin && (
                                <td style={{ textAlign: 'right', padding: '10px 10px' }}>
                                    <button
                                        onClick={() => handleEditClick(adress._id, adress.adress, adress.floors)}
                                        style={{
                                            marginRight: '10px',
                                            backgroundColor: '#333',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                        }}
                                    >Edit</button>
                                    <button
                                        onClick={() => handleDeleteAdress(adress._id)}
                                        style={{
                                            marginRight: '10px',
                                            backgroundColor: '#333',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                        }}
                                    >Delete</button>
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={isAdmin ? 3 : 1}>No addresses available ...</td>
                    </tr>
                )}
                </tbody>
            </table>

            {isAdmin && (
                <div>
                    <h2>Tenants:</h2>
                    {tenants.length > 0 ? (
                    <table
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: '#333',
                            color: '#ffffff',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px 20px' }}>Companyname</th>
                                <th style={{ textAlign: 'right', padding: '10px 20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} style={{ backgroundColor: '#ffffff', color: '#333', borderBottom: '1px solid #333' }}>
                                    <td style={{ textAlign: 'left', padding: '10px 10px' }}>{tenant.companyname}</td>
                                    <td style={{ textAlign: 'right', padding: '10px 10px' }}>
                                        <button
                                            onClick={() => navigate(`/tenants/${tenant.id}`)}
                                            style={{
                                                marginRight: '10px',
                                                backgroundColor: '#333',
                                                color: '#ffffff',
                                                border: 'none',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                            }}
                                        >Show Tenant</button>
                                        {isAdmin && (<button
                                            onClick={() => navigate(`/tenants/${tenant.id}/edit`)}
                                            style={{
                                                marginRight: '10px',
                                                backgroundColor: '#333',
                                                color: '#ffffff',
                                                border: 'none',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                              }}
                                        >Edit Tenant</button>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>There are no tenants to show ...</p>)}
                </div>
            )}

            {isAdmin && (<form onSubmit={ editState ? handleEditAdress : handleCreateAdress}>
                <input
                    type="text"
                    placeholder="Adress ..."
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                /><br />
                <input
                    type="text"
                    placeholder="Comma separated floors ..."
                    value={floors}
                    onChange={ e => setFloors(e.target.value) }
                />
                <input
                    type="submit"
                    value={editState ? 'Save' : 'Create'}
                />
                {error && (<p>{error}</p>)}
            </form>)}
        </>
    );
};
