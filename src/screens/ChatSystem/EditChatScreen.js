import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAllUsersAPI } from "../../axios/user";
import { editChatByIdAPI, getChatByIdAPI, getChatUsersByChatIdAPI } from "../../axios/chat";

import "../../css/general.css";
import "../../css/form.css";

export const EditChatScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const { chatId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [potentialUsers, setPotentialUsers] = useState([]);

    const [chatname, setChatname] = useState('');
    const [chatrights, setChatrights] = useState('');
    const [chatusers, setChatusers] = useState('');
    const [isChatAdmin, setIsChatAdmin] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            const response = await getAllUsersAPI();
            setPotentialUsers(response.data.data.users);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (chatId) {
                const chatData = await getChatByIdAPI(chatId);
                setChatname(chatData.data.data.chat.chatname);
                setChatrights(chatData.data.data.chat.chatrights);
                const chatUsersData = await getChatUsersByChatIdAPI(chatId);
                const userNames = chatUsersData.data.data.users.map(user => user.name).join(', ');
                setChatusers(userNames);
                const chatAdmins = chatUsersData.data.data.users.reduce((acc, user) => {
                    if (user.isAdmin) {
                        acc[user.name] = user.isAdmin;
                    }
                    return acc;
                }, {});

                setIsChatAdmin(chatAdmins);
            }
        })();
    }, [chatId]);

    const handleUserChange = (userId) => {
        setIsChatAdmin(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    const checkUsers = () => {
        const usernames = chatusers.split(',').map(name => name.trim()).filter(name => name);

        const usersArray = usernames.map(username => {
            const userObj = potentialUsers.find(user => user.name === username);
            if (!userObj) {
                console.error(`User ${username} not found.`);
                return null;
            }

            return [
                userObj.id,
                !!isChatAdmin[username]
            ];
        }).filter(user => user !== null);
        
        return usersArray;
    };

    const handleEditChat = async (e) => {
        e.preventDefault();

        if (!chatname) {
            setError('The chatname can not be left empty!');
            return;
        }
        if (!chatrights) {
            setError('The chatrights can not be left empty!');
            return;
        }
        const users = checkUsers();
        if (!users) {
            setError('The users can not be left empty!');
            return;
        }

        const response = await editChatByIdAPI(chatId, chatname, users, chatrights);
        if (response) {
            navigate(`/chats/${chatId}`);
        }
    };

    return (
        <>
            <h1>Edit Chat</h1>
            <form onSubmit={handleEditChat}>
                <input
                    type="text"
                    placeholder="Chatname"
                    value={chatname}
                    onChange={(e) => setChatname(e.target.value)}
                /><br />
                <select value={chatrights} onChange={(e) => setChatrights(e.target.value)}>
                    <option value="admins">Admins</option>
                    <option value="everyone">Everyone</option>
                </select><br />
                <input
                    type="text"
                    placeholder="Chatusers (comma-separated usernames)"
                    value={chatusers}
                    onChange={(e) => setChatusers(e.target.value)}
                /><br />
                {chatusers.split(',').filter(user => user.trim()).map((user, index) => (
                    <div key={index} className={`custom_checkbox_div`}>
                        <label className={`custom_checkbox_label`}>
                            {user.trim()}:
                            <input
                                type="checkbox"
                                checked={!!isChatAdmin[user.trim()]}
                                onChange={() => handleUserChange(user.trim())}
                            />
                            <span className={`custom_checkbox_span`} style={{backgroundColor: !!isChatAdmin[user.trim()] ? '#333' : '#fff'}}>
                                { !!isChatAdmin[user.trim()] && (
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

