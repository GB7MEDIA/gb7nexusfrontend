import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadMultipleFiles } from "../axios/upload";

import "../css/general.css";

export const TestScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleFilesChange = (e) => {
        setFiles(e.target.files);
    };

    const uploadFiles = async (e) => {
        e.preventDefault();

        if (!files || files.length === 0) {
            alert('No files selected.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await uploadMultipleFiles(formData);
            console.log(response);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <form onSubmit={uploadFiles}>
            <input type="file" onChange={handleFilesChange} multiple />
            <input type="submit" value="Upload" />
        </form>
    );
};

