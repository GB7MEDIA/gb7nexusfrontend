import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAllChatsByUserIdAPI } from "../../axios/chat";

import "../../css/general.css";

export const ChatsScreen = ({ isLoggedIn, currentUserId }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        (async () => {
            if (currentUserId) {
                const chatsData = await getAllChatsByUserIdAPI(currentUserId);
                setChats(chatsData.data.data.chats);
            }
        })()
    }, [currentUserId]);

    return (
        <>
            <h1>Chats</h1>
            {chats.length > 0 ? (
                <ul>
                {chats.map((chat) => (
                    <li key={chat.id} style={{ listStyle: 'none', marginBottom: '20px' }}>
                        <Link
                            to={`/chats/${chat.id}`}
                            style={{
                                backgroundColor: '#333',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                        >{chat.chatname}</Link>
                    </li>
                ))}
            </ul>
            ) : (<p>No chats exist!</p>)}
        </>
    );
};

