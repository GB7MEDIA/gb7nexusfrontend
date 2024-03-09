import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadMultipleFiles } from "../../axios/upload";
import { createProductAPI } from "../../axios/marketPlace";

import "../../css/general.css";
import "../../css/form.css";

export const CreateProductScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [title, setTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        if (!title) {
            setError('The title can not be left empty!');
            return;
        }

        if (!files) {
            setError('The files can not be left empty!');
            return;
        }

        if (!description) {
            setError('The description can not be left empty!');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        const filesResponse = await uploadMultipleFiles(formData);
        const mediaUrls = filesResponse.data.data.mediaUrls;

        const response = await createProductAPI(title, mediaUrls, description);
        if (response) {
            navigate('/products');
        }
    }

    return (
    <>
        <h1>Create Product</h1>
        <form onSubmit={handleCreateProduct}>
            <input
                type="text"
                placeholder="Title ..."
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input type="file" onChange={ e => setFiles(e.target.files)} multiple />
            <textarea
                placeholder="Description ..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>
            <input
                type="submit"
                value="Create"
            />
            {error && (<p>{error}</p>)}
        </form>
    </>
    );
}