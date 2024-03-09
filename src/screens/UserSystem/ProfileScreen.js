import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getUserByIdAPI, deleteUserByIdAPI } from "../../axios/user";
import { getAllDamagesByUserIdAPI } from "../../axios/damage";

import "../../css/general.css";
import "../../css/table.css";

export const ProfileScreen = ({ isLoggedIn, currentUserId, setIsLoggedIn, setIsAdmin }) => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [damages, setDamages] = useState([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await getUserByIdAPI(userId);
                if (userResponse.success) {
                    setUser(userResponse.data.response.data.data.user);
                }

                const damagesResponse = await getAllDamagesByUserIdAPI(userId);
                setDamages(damagesResponse.data.data.damages);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleDeleteUser = async () => {
        try {
            const response = await deleteUserByIdAPI(userId);
            if (response.success) {
                setIsLoggedIn(false);
                setIsAdmin(false);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    if (!user) return <p>Loading user profile...</p>;

    return (
        <>
            <h1>{user.name}'s Profile</h1>
            {userId === currentUserId && (
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/settings" style={{
                        marginRight: '10px',
                        backgroundColor: '#333',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 10px',
                        textDecoration: 'none'
                    }}>Settings</Link>
                    <button onClick={handleDeleteUser} style={{
                        backgroundColor: '#333',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}>Delete User</button>
                </div>
            )}
            <h3>Damages Table:</h3>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (<p>There are no damages to show ...</p>)}
        </>
    );
};




