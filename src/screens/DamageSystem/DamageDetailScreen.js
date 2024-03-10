import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getDamageByIdAPI } from "../../axios/damage";
import { getObjectByIdAPI, getObjectAdressesByObjectIdAPI } from "../../axios/object";

import "../../css/general.css";

export const DamageDetailScreen = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    const { damageId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [damageDetails, setDamageDetails] = useState({
        damageId: '',
        title: '',
        file: '',
        object: {
            _id: '',
            objectname: ''
        },
        adress: {
            _id: '',
            adress: ''
        },
        floorOrElevator: '',
        remarks: '',
        damageStatus: ''
    });

    useEffect(() => {
        const fetchDamageDetails = async () => {
            if (damageId) {
                try {
                    const damageData = await getDamageByIdAPI(damageId);

                    setDamageDetails(currentFormData => ({
                        ...currentFormData,
                        damageId: damageId,
                        title: damageData.data.data.damage.title,
                        file: damageData.data.data.damage.file,
                        object: {
                            id: damageData.data.data.damage.object.id,
                            objectname: damageData.data.data.damage.object.objectname
                        },
                        adress: {
                            id: damageData.data.data.damage.adress.id,
                            adress: damageData.data.data.damage.adress.adress
                        },
                        floorOrElevator: damageData.data.data.damage.floor,
                        remarks: damageData.data.data.damage.remarks,
                        damageStatus: damageData.data.data.damage.damageStatus,
                    }));
                } catch (error) {
                    console.error('Failed to fetch damage details:', error);
                }
            }
        };
        fetchDamageDetails();
    }, [damageId]);

    return (
        <>
            <h1>{damageDetails.title}</h1>
            {isAdmin &&(<button
                            onClick={() => navigate(`/damages/${damageId}/edit`)}
                            style={{
                                marginRight: '10px',
                                backgroundColor: '#333',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                        >Edit Damage</button>)}
            <div>
                {damageDetails.file && (<img src={`http://localhost:4000/uploads/${damageDetails.file}`} />)}
                <p><strong>Objectname:</strong> {damageDetails.object.objectname}</p>
                <p><strong>Adress:</strong> {damageDetails.adress.adress}</p>
                <p><strong>Floor/Elevator:</strong> {damageDetails.floorOrElevator}</p>
                <p><strong>Remarks:</strong> {damageDetails.remarks}</p>
                <p><strong>Damage Status:</strong> {damageDetails.damageStatus}</p>
            </div>
        </>
    );
};
