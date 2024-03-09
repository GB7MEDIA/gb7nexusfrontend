import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllDamagesAPI, getAllDamagesByUserIdAPI } from "../../axios/damage";

import "../../css/general.css";
import "../../css/table.css";

export const DamagesScreen = ({ isLoggedIn, isAdmin, currentUserId }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);
    
    const [damages, setDamages] = useState([]);

    useEffect(() => {
        (async () => {
            if (currentUserId && isAdmin === false) {
                const damagesData = await getAllDamagesByUserIdAPI(currentUserId);
                let damagesDataArray = damagesData.data.data.damages;
                if (!Array.isArray(damagesDataArray)) {
                    damagesDataArray = [damagesDataArray];
                }
                setDamages(damagesDataArray);
            } else {
                const damagesData = await getAllDamagesAPI();
                let damagesDataArray = damagesData.data.data.damages;
                if (!Array.isArray(damagesDataArray)) {
                    damagesDataArray = [damagesDataArray];
                }
                setDamages(damagesDataArray);
            }
        })()
    }, [currentUserId, isAdmin]);

    return (
        <>
            <h1>Damages</h1>
            <div>
            {damages.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Object</th>
                                <th>Adress</th>
                                <th>Floor/Elevator</th>
                                <th>Remarks</th>
                                <th>Damage Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    <tbody>
                        {damages.map((damage) => (
                            <tr key={damage.id}>
                                <td>{damage.title}</td>
                                <td>{damage.user.name}</td>
                                <td>{damage.object.objectname}</td>
                                <td>{damage.adress.adress}</td>
                                <td>{damage.floor}</td>
                                <td>{damage.remarks}</td>
                                <td>{damage.damageStatus}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/damages/${damage.id}`)}
                                    >Show Damage</button>
                                    {isAdmin &&(<button
                                        onClick={() => navigate(`/damages/${damage.id}/edit`)}
                                    >Edit Damage</button>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (<p>There are no damages to show ...</p>)}
            </div>
        </>
    );
};
