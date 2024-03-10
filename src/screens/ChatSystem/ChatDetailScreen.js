import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getChatByIdAPI, getChatUsersByChatIdAPI, getChatMessagesByChatIdAPI, createChatMessageByChatIdAPI, editChatMessageByIdAPI, deleteChatByIdAPI, deleteChatMessageByIdAPI } from "../../axios/chat";
import { getUserByIdAPI } from "../../axios/user";

import "../../css/general.css";
import "../../css/form.css";

export const ChatDetailScreen = ({ isLoggedIn, currentUserId }) => {
    const navigate = useNavigate();
    const { chatId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [isChatAdmin, setIsChatAdmin] = useState(false);

    const [chat, setChat] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageId, setMessageId] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [editState, setEditState] = useState(false);

    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            if (chatId) {
                try {
                    const chatData = await getChatByIdAPI(chatId);
                    setChat(chatData.data.data.chat);
                    const chatUsersData = await getChatUsersByChatIdAPI(chatId);
                    setChatUsers(chatUsersData.data.data.users);
                    const chatMessagesData = await getChatMessagesByChatIdAPI(chatId);
                    setChatMessages(chatMessagesData.data.data.messages);
                } catch (error) {
                    console.error("Failed to fetch chat or user data:", error);
                }
            }
        })();
    }, [chatId]);

    useEffect(() => {
        const checkUser = () => {
            if (currentUserId) {
                const user = chatUsers.find(user => user._id === currentUserId);
                if (user) {
                    return user.isAdmin;
                } else {
                    return false;
                }
            }
            return false;
        };

        const currentUserIsChatAdmin = checkUser();
        setIsChatAdmin(currentUserIsChatAdmin);
        
    }, [chatUsers, currentUserId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!chatMessage) {
            setError('The chat message can not be left empty!');
            return;
        }

        const response = await createChatMessageByChatIdAPI(chatId, chatMessage);
        console.log(response);
    };

    const handleEditClick = (messageId, text) => {
        setEditState(true);
        setMessageId(messageId);
        setChatMessage(text);
    };

    const handleEditMessage = async (e) => {
        e.preventDefault();

        if (!chatMessage) {
            setError('The chat message can not be left empty!');
            return;
        }

        const response = await editChatMessageByIdAPI(messageId, chatMessage);
        console.log(response);
    };

    const handleDeleteChat = async (chatId) => {
        const response = await deleteChatByIdAPI(chatId);
        if (response) {
            navigate('/chats');
        }
    }

    const handleDeleteMessage = async (messageId) => {
        const response = await deleteChatMessageByIdAPI(messageId);
        console.log(response);
    }

    return (
        <>
        {isLoggedIn && (<>
            <h1>{chat.chatname}</h1>
            <p>Chat created by {chat.createdBy?.name}</p>
            {isChatAdmin && (<Link
            style={{
                marginRight: '10px',
                backgroundColor: '#333',
                color: '#ffffff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                textDecoration: 'none'
            }}
             to={`/chats/${chatId}/edit`}>Edit Chat</Link>)}
             {isChatAdmin && (<button 
            style={{
                marginRight: '10px',
                backgroundColor: '#333',
                color: '#ffffff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                textDecoration: 'none'
            }}
            onClick={() => handleDeleteChat(chatId)}>Delete</button>)}
            <ul>
                {chatMessages.length > 0 ? (
                    chatMessages.map(message => (
                        <li key={message.id}>
                            <p><strong>{message.user.name}</strong> - {message.text}</p>
                            {currentUserId === message.user.id && <button
                            style={{
                                marginRight: '10px',
                                backgroundColor: '#333',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onClick={() => handleEditClick(message.id, message.text)}>Edit</button>}
                            {currentUserId === message.user.id && <button
                            style={{
                                marginRight: '10px',
                                backgroundColor: '#333',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onClick={() => handleDeleteMessage(message._id)}>Delete</button>}
                        </li>
                    ))
                ) : (
                    <p>No messages in this chat.</p>
                )}
            </ul>
            {(chat.chatrights === "everyone" || (chat.chatrights === "admins" && isChatAdmin)) && (
                <form onSubmit={editState ? handleEditMessage : handleSendMessage}>
                    <input type="text" placeholder="Type your message..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                    <button type="submit">{editState ? 'Save' : 'Send'}</button>
                    {error && (<p>{error}</p>)}
                </form>
            )}
        </>)}
        </>
    );
};




