import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getProductByIdAPI, editProductByIdAPI } from "../../axios/marketPlace";

import "../../css/general.css";
import "../../css/form.css";

export const EditProductScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const { productId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            if (productId) {
                const product = await getProductByIdAPI(productId);
                setTitle(product.data.data.product.title);
                setDescription(product.data.data.product.description);
            }
        })()
    }, [productId]);

    const handleEditProduct = async (e) => {
        e.preventDefault();

        if (!title) {
            setError('The title can not be left empty!');
            return;
        }

        if (!description) {
            setError('The description can not be left empty!');
            return;
        }

        const response = await editProductByIdAPI(productId, title, description);
        if (response) {
            navigate('/');
        }
    }

    return (
    <>
        <h1>Edit Product</h1>
        <form onSubmit={handleEditProduct}>
            <input
                type="text"
                placeholder="Title ..."
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Description ..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>
            <input
                type="submit"
                value="Save"
            />
            {error && (<p>{error}</p>)}
        </form>
    </>
    );
}