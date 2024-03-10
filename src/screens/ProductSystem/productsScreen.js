import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllProductsAPI, deleteProductByIdAPI } from "../../axios/marketPlace";
import { createChatAPI } from "../../axios/chat";

import "../../css/general.css";
import "../../css/table.css";

export const ProductsScreen = ({ isLoggedIn, currentUserId }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);
    
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            const productsData = await getAllProductsAPI();
            setProducts(productsData.data.data.products);
        })()
    }, []);

    const handleInterestedInProduct = async ( productId, productTitle, productUserId, currentUserId ) => {
        if (productUserId === currentUserId) {
            return;
        }
        const users = [
            [productUserId, true],
            [currentUserId, false]
        ];
    
        if (!productTitle) {
            return;
        }
    
        const title = "Product: " + productTitle + "-" + productId;
    
        const response = await createChatAPI(title, users, 'everyone');
        if (response) {
            navigate(`/chats`);
        }
      }

      const handleDeleteProduct = async (productId) => {
        const response = await deleteProductByIdAPI(productId);
        if (response) {
            navigate('/');
        }
      }

    return (
        <>
            <h1>Products</h1>
                {products.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>User</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.description}</td>
                                <td>{product.user.name}</td>
                                <td>
                                    {(product.user.id !== currentUserId) && (<button
                                        onClick={ () => navigate(`/products/${product.id}`) }
                                    >
                                        Show Product
                                    </button>)}
                                    {(product.user.id !== currentUserId) && (<button
                                        onClick={ () => handleInterestedInProduct(product.id, product.title, product.user.id, currentUserId) }
                                    >
                                        Interested
                                    </button>)}
                                    {(product.user.id === currentUserId) && (<button
                                        onClick={ () => navigate(`/products/${product.id}/edit`) }
                                    >
                                        Edit Product
                                    </button>)}
                                    {(product.user.id === currentUserId) && (<button
                                        onClick={ () => handleDeleteProduct(product.id) }
                                    >
                                        Delete Product
                                    </button>)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (<p>There are no channels to show ...</p>)}
        </>
    );
};