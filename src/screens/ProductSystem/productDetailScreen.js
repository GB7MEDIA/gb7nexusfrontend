import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getProductByIdAPI } from "../../axios/marketPlace";

import "../../css/general.css";

export const ProductDetailScreen = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const { productId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [productDetails, setProductDetails] = useState({
        title: '',
        files: [],
        description: ''
    });

    useEffect(() => {
        (async () => {
            const product = await getProductByIdAPI(productId);
            setProductDetails({
                title: product.data.data.product.title,
                files: product.data.data.product.files,
                description: product.data.data.product.description
            });
        })()
    }, [setProductDetails]);

    useEffect(() => {
        if (productDetails) {
            console.log(productDetails);
        }
    }, [productDetails]);

    return (
        <>
        <h1>{productDetails.title}</h1>
        {(productDetails.files && Array.isArray(productDetails.files)) && (
            productDetails.files.map((file) => (
                <img src={`http://localhost:4000/uploads/` + file} alt={file} key={file} />
            ))
        )}
        <p>{productDetails.description}</p>
        </>
    );
};