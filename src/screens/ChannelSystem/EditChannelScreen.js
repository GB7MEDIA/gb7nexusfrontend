import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAllUsersAPI } from "../../axios/user";
import { getChannelByIdAPI, getChannelUsersByChannelIdAPI, editChannelByIdAPI } from "../../axios/channel";

import "../../css/general.css";
import "../../css/form.css";

export const EditChannelScreen = ({ isLoggedIn, currentUserId }) => {
    const navigate = useNavigate();
    const { channelId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [potentialUsers, setPotentialUsers] = useState([]);

    const [channelname, setChannelname] = useState('');
    const [channelrights, setChannelrights] = useState('');
    const [channelusers, setChannelusers] = useState('');
    const [isChannelAdmin, setIsChannelAdmin] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            const response = await getAllUsersAPI();
            setPotentialUsers(response.data.response.data.data.users);
        })();
    }, [setPotentialUsers]);

    useEffect(() => {
        (async () => {
            if (channelId) {
                const channelData = await getChannelByIdAPI(channelId);
                setChannelname(channelData.data.data.channel.channelname);
                setChannelrights(channelData.data.data.channel.channelrights);
                const channelUsersData = await getChannelUsersByChannelIdAPI(channelId);
                const userNames = channelUsersData.data.data.users.map(user => user.name).join(', ');
                setChannelusers(userNames);
                const channelAdmins = channelUsersData.data.data.users.reduce((acc, user) => {
                    if (user.isAdmin) {
                        acc[user.name] = user.isAdmin;
                    }
                    return acc;
                }, {});
                setIsChannelAdmin(channelAdmins);
            }
        })()
    }, [channelId]);

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

    const handleEditChannel = async (e) => {
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

        const response = await editChannelByIdAPI(channelId, channelname, users, channelrights);
        if (response) {
            if (channelId) {
                navigate(`/channels/${channelId}`);
            }
        }
    };

    return (
        <>
            <h1>Edit Channel</h1>
            <form onSubmit={handleEditChannel}>
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
                    value="Save"
                />
                {error && (<p>{error}</p>)}
            </form>
        </>
    );
};
