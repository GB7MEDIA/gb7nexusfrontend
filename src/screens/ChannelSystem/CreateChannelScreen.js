import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllUsersAPI } from "../../axios/user";
import { createChannelAPI } from "../../axios/channel";

import "../../css/general.css";
import "../../css/form.css";

export const CreateChannelScreen = ({ isLoggedIn, isAdmin }) => {
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

    const [potentialUsers, setPotentialUsers] = useState([]);
    
    const [channelname, setChannelname] = useState('');
    const [channelrights, setChannelrights] = useState('admins');
    const [channelusers, setChannelusers] = useState('');
    const [isChannelAdmin, setIsChannelAdmin] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            const response = await getAllUsersAPI();
            setPotentialUsers(response.data.response.data.data.users);
        })();
    }, []);

    const handleUserChange = (userId) => {
        setIsChannelAdmin(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    const checkUsers = () => {
        const usernames = channelusers.split(',').map(name => name.trim()).filter(name => name);

        const usersArray = usernames.map(username => {
            const userObj = potentialUsers.find(user => user.name === username);
            if (!userObj) {
                console.error(`User ${username} not found.`);
                return null;
            }

            return [
                userObj._id,
                !!isChannelAdmin[username]
            ];
        }).filter(user => user !== null);
        
        return usersArray;
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        
        if (!channelname) {
            setError('The channelname can not be left empty!');
            return;
        }
        if (!channelrights) {
            setError('The channelrights can not be left empty!');
            return;
        }
        const users = checkUsers();
        if (!users) {
            setError('The users can not be left empty!');
            return;
        }

        const response = await createChannelAPI(channelname, users, channelrights);
        console.log(response);
    };

    return (
        <>
            <h1>Create Channel</h1>
            <form onSubmit={handleCreateChannel}>
                <input
                    type="text"
                    placeholder="Channelname"
                    value={channelname}
                    onChange={(e) => setChannelname(e.target.value)}
                /><br />
                <select value={channelrights} onChange={(e) => setChannelrights(e.target.value)}>
                    <option value="admins">Admins</option>
                    <option value="everyone">Everyone</option>
                </select><br />
                <input
                    type="text"
                    placeholder="Channelusers (comma-separated user names)"
                    value={channelusers}
                    onChange={(e) => setChannelusers(e.target.value)}
                /><br />
                {channelusers.split(',').filter(user => user.trim()).map((user, index) => (
                    <div key={index} className={`custom_checkbox_div`}>
                        <label className={`custom_checkbox_label`}>
                            {user.trim()}:
                            <input
                                type="checkbox"
                                checked={!!isChannelAdmin[user.trim()]}
                                onChange={() => handleUserChange(user.trim())}
                            />
                            <span className={`custom_checkbox_span`} style={{backgroundColor: !!isChannelAdmin[user.trim()] ? '#333' : '#fff'}}>
                                { !!isChannelAdmin[user.trim()] && (
                                    <span className={`custom_checkbox_inner_span`}></span>
                                )}
                            </span>
                            <span className={`custom_checkbox_extra_span`}>Admin</span>
                        </label><br />
                    </div>
                ))}
                <input
                    type="submit"
                    value="Create"
                />
                {error && (<p>{error}</p>)}
            </form>
        </>
    );
};