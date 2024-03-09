import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsersAPI, deleteUserByIdAPI } from "../../axios/user";

import "../../css/general.css";
import "../../css/table.css";

export const UsersScreen = ({ isLoggedIn, isAdmin, currentUserId }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        } else if (!isAdmin) {
            navigate("/");
        } else {
            const fetchUsers = async () => {
                try {
                    const usersData = await getAllUsersAPI();
                    setUsers(usersData.data.response.data.data.users);
                } catch (error) {
                    console.error("Failed to fetch users", error);
                }
            };
            fetchUsers();
        }
    }, [isLoggedIn, isAdmin, navigate]);

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUserByIdAPI(userId);
            if (response.success) {
                navigate(`/users`);
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    return (
        <>
            <h1>Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>Role</th>
                        <th>tfaSetting</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(user => user.id !== currentUserId).map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phonenumber}</td>
                            <td>{user.role}</td>
                            <td>{user.tfaSetting}</td>
                            <td>
                                <button onClick={() => navigate(`/users/${user.id}/edit`)}>Edit User</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

