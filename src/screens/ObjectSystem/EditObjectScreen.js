import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getObjectByIdAPI, editObjectByIdAPI } from "../../axios/object";

import "../../css/general.css";
import "../../css/form.css";

export const EditObjectScreen = ({ isLoggedIn, isAdmin }) => {
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
    
    const { objectId } = useParams();

    const [objectname, setObjectname] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            if (objectId) {
                const objectData = await getObjectByIdAPI(objectId);
                setObjectname(objectData.data.data.object.objectname);
            }
        })()
    }, [objectId, setObjectname]);

    const handleEditObject = async (e) => {
        e.preventDefault();
        if (!objectname) {
            setError('The objectname can not be left empty!');
            return;
        }

        const response = await editObjectByIdAPI(objectId, objectname);
        if (response) {
            navigate(`/objects/${objectId}`);
        }
    };

    return (
        <>
            <h1>Edit Object</h1>
            <form onSubmit={handleEditObject}>
                <input 
                    type="text" 
                    placeholder="Objectname ..." 
                    value={objectname}
                    onChange={(e) => setObjectname(e.target.value)}
                /><br />
                <input
                    type="submit"
                    value="Save"
                />
                {error && (<p>{error}</p>)}
            </form>
        </>
    );
};
