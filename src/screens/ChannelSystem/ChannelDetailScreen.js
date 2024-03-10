import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
    getChannelByIdAPI,
    getChannelMessagesByChannelIdAPI,
    getChannelUsersByChannelIdAPI,
    createChannelMessageByChannelIdAPI,
    editChannelMessageByIdAPI,
    deleteChannelByIdAPI,
    deleteChannelMessageByIdAPI
} from "../../axios/channel";

import { getUserByIdAPI } from "../../axios/user";

import "../../css/general.css";
import "../../css/form.css";

export const ChannelDetailScreen = ({ isLoggedIn, currentUserId }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const { channelId } = useParams();

    const [isChannelAdmin, setIsChannelAdmin] = useState();

    const [channel, setChannel] = useState([]);
    const [channelUsers, setChannelUsers] = useState([]);
    const [channelMessages, setChannelMessages] = useState([]);
    const [messageId, setMessageId] = useState('');
    const [title, setTitle] = useState('');
    const [channelMessage, setChannelMessage] = useState('');
    const [editState, setEditState] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            if (channelId) {
                const channelData = await getChannelByIdAPI(channelId);
                setChannel(channelData.data.data.channel);
                const channelUsersData = await getChannelUsersByChannelIdAPI(channelId);
                setChannelUsers(channelUsersData.data.data.users);
                const channelMessagesData = await getChannelMessagesByChannelIdAPI(channelId);
                setChannelMessages(channelMessagesData.data.data.messages);
            }
        })();
    }, [channelId]);

    useEffect(() => {
        const checkUser = () => {
            if (currentUserId) {
                const user = channelUsers.find(user => user._id === currentUserId);
                return user ? user.isAdmin : false;
            }
            return false;
        };

        const currentUserIsChannelAdmin = checkUser(); 
        setIsChannelAdmin(currentUserIsChannelAdmin);
        
    }, [channelUsers, currentUserId]); 

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!title) {
            setError('The title can not be left empty!');
            return;
        }

        if (!channelMessage) {
            setError('The message can not be left empty!');
            return;
        }

        const response = await createChannelMessageByChannelIdAPI(channelId, title, channelMessage);
        console.log(response);
    };

    const handleEditMessageClick = (messageId, title, text) => {
        setEditState(true);
        setMessageId(messageId);
        setTitle(title);
        setChannelMessage(text);
    }

    const handleEditMessage = async (e) => {
        e.preventDefault();

        if (!title) {
            setError('The title can not be left empty!');
            return;
        }

        if (!channelMessage) {
            setError('The message can not be left empty!');
            return;
        }

        const response = await editChannelMessageByIdAPI(messageId, title, channelMessage);
        console.log(response);
    }

    const handleDeleteMessage = async (messageId) => {
        const response = await deleteChannelMessageByIdAPI(messageId);
        console.log(response);
    }

    const handleDeleteChannel = async (channelId) => {
        const response = await deleteChannelByIdAPI(channelId);
        if (response) {
            navigate('/channels');
        }
    }

    return (
        <>
        {isLoggedIn && (
        <>
            <h1>{channel.channelname}</h1>
            <p>Channel created by {channel.createdBy?.name}</p>
            {isChannelAdmin && (<Link
                to={`/channels/${channelId}/edit`}
                style={{
                    marginRight: '10px',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                }}
                >Edit Channel</Link>)}
            {isChannelAdmin && (<button
                onClick={() => handleDeleteChannel(channelId)}
                style={{
                    marginRight: '10px',
                    backgroundColor: '#333',
                    color: '#ffffff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                }}
                >Delete</button>)}
            <ul>
                {channelMessages.length > 0 ? (
                    channelMessages.map(message => (
                        <li key={message.id}>
                            <h2>{message.title}</h2>
                            <strong>{message.user.name}</strong>
                            <p>{message.text}</p>
                            { currentUserId === message.user.id && (<button
                                onClick={() => handleEditMessageClick(message.id, message.title, message.text)}
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: '#333',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '5px 10px',
                                    cursor: 'pointer'
                                }}
                                >Edit</button>) }
                            { currentUserId === message.user.id && (<button
                                onClick={() => handleDeleteMessage(message.id)}
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: '#333',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                }}
                                >Delete</button>) }
                        </li>
                    ))
                ) : (
                    <p>No messages in this channel.</p>
                )}
            </ul>

            {(channel.channelrights === "everyone" || (channel.channelrights === "admins" && isChannelAdmin)) && (
                <form
                    onSubmit={editState ? handleEditMessage : handleSendMessage}
                >
                    <input type="text" placeholder="Title ..." value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" placeholder="Type your message..." value={channelMessage} onChange={(e) => setChannelMessage(e.target.value)} />
                    <button
                    type="submit"
                    >{editState ? 'Save' : 'Send'}</button>
                    {error && (<p>{error}</p>)}
                </form>
            )}
        </>
        )}
        </>
    );
};
