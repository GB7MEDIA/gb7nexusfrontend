import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllObjectsAPI } from "../../axios/object";

import "../../css/general.css";
import "../../css/table.css";

export const ObjectsScreen = ({ isLoggedIn, isAdmin, currentUserId, currentUser }) => {
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

    useEffect(() => {
        (async () => {
            const objectsData = await getAllObjectsAPI();
            setObjects(objectsData.data.data.objects);
        })()
    }, []);

    return (
        <>
            <h1>Objects</h1>
            {objects.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Objectname</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {objects.map((objectsObject) => (
                        <tr key={objectsObject._id}>
                            <td>{objectsObject.objectname}</td>
                            <td>
                                <button
                                    onClick={() => navigate(`/objects/${objectsObject._id}`)}
                                >Show Object</button>
                                <button
                                    onClick={() => navigate(`/objects/${objectsObject._id}/edit`)}
                                >Edit Object</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                <p>There are no objects to show ...</p>
                )}
        </>
    );
};
