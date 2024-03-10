import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    getAllObjectsAPI,
    getObjectByIdAPI
} from "../axios/object";

import {
    getAllTenantsAPI,
    getTenantByUserIdAPI,
    getTenantByIdAPI
} from "../axios/tenant";

import {
    getAllUsersAPI
} from "../axios/user";

import {
    getAllDamagesAPI,
    getAllDamagesByUserIdAPI,
    deleteDamageByIdAPI
} from "../axios/damage";

import {
    createChatAPI
} from "../axios/chat";

import {
    getAllChannelsAPI,
    getAllChannelsByUserIdAPI
} from "../axios/channel";

import {
    getAllProductsAPI
} from "../axios/marketPlace";

import "../css/general.css";
import "../css/table.css";

export const DashboardScreen = ({ isLoggedIn, isAdmin, currentUserId }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    objects: [],
    object: [],
    tenants: [],
    tenant: [],
    users: [],
    damages: [],
    channels: [],
    products: [],
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && currentUserId) {
        (async () => {
            if (isAdmin) {
                const objectsData = await getAllObjectsAPI();
                const tenantsData = await getAllTenantsAPI();
                const usersData = await getAllUsersAPI();
                const damagesData = await getAllDamagesAPI();
                const channelsData = await getAllChannelsAPI();
                const productsData = await getAllProductsAPI();
                setData({
                    objects: objectsData.data.data.objects ?? [],
                    object: [],
                    tenants: tenantsData.data.data.tenants ?? [],
                    tenant: [],
                    users: usersData.data.data.users ?? [],
                    damages: damagesData.data.data.damages ?? [],
                    channels: channelsData.data.data.channels ?? [],
                    products: productsData.data.data.products ?? [],
                });
            } else {
                const tenantIdData = await getTenantByUserIdAPI(currentUserId);
                const tenantId = tenantIdData.data.data.tenantId.tenantId;
                const tenantData = await getTenantByIdAPI(tenantId);
                const objectData = await getObjectByIdAPI(tenantData.data.data.tenant.object.id);
                const damagesData = await getAllDamagesByUserIdAPI(currentUserId);
                const channelsData = await getAllChannelsByUserIdAPI(currentUserId);
                const productsData = await getAllProductsAPI();
                setData({
                    objects: [],
                    object: objectData.data.data.object ?? [],
                    tenants: [],
                    tenant: tenantData.data.data.tenant ?? [],
                    users: [],
                    damages: damagesData.data.data.damages ?? [],
                    channels: channelsData.data.data.channels ?? [],
                    products: productsData.data.data.products ?? [],
                });
            }
        })()
    }
  }, [isLoggedIn, isAdmin, currentUserId]);

  const handleDeleteDamage = async (damageId) => {
    const response = await deleteDamageByIdAPI(damageId);
    if (response) {
      const updatedDamages = data.damages.filter((damage) => damage.id !== damageId);
      setData((prevState) => ({ ...prevState, damages: updatedDamages }));
    }
  };

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

 const renderAdminDashboard = () => {
    return (
      <>
        <h2>Admin Dashboard</h2>
        <h3>Objects:</h3>
        {data['objects'].length > 0 ? (
        <table>
            <thead>
                <tr>
                    <th>Objectname</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data['objects'].map((objectsObject) => (
                    <tr key={objectsObject._id}>
                        <td>{objectsObject.objectname}</td>
                        <td>
                            <button
                                onClick={() => navigate(`/objects/${objectsObject._id}`)}
                            >Show Object</button>
                            <button
                                onClick={() => navigate(`/objects/${objectsObject._id}/edit`)}
                            >Edit Object</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        ) : (
            <p>There are no objects to show ...</p>
        )}
        <h3>Tenants:</h3>
        {data['tenants'].length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Companyname</th>
                        <th>Object</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {data['tenants'].map((tenant) => (
                    <tr key={tenant.id}>
                        <td>{tenant.companyname}</td>
                        <td>
                            <Link
                                to={`/objects/${tenant.object.id}`}
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: '#333',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                            >{tenant.object.objectname}</Link>
                        </td>
                        <td>
                            <button
                                onClick={() => navigate(`/tenants/${tenant._id}`)}
                            >Show Tenant</button>
                            <button
                                onClick={() => navigate(`/tenants/${tenant._id}/edit`)}
                            >Edit Tenant</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
            <p>There are no tenants to show ...</p>
        )}
        <h3>Users:</h3>
        {data['users'].length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>Role</th>
                        <th>tfaSetting</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {data['users'].map((user) => (
                    user.id !== currentUserId ?
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phonenumber}</td>
                        <td>{user.role}</td>
                        <td>{user.tfaSetting}</td>
                        <td>
                            <button
                                onClick={() => navigate(`/users/${user.id}/edit`)}
                            >Edit User</button>
                        </td>
                    </tr> : null
                ))}
                </tbody>
            </table>
        ) : (
            <p>There are no users to show ...</p>
        )}
      </>
    );
  };

  const renderUserDashboard = () => {
    return (
    <>
    <h2>User Dashboard</h2>
    <h3>Object:</h3>
    {data['object'] ? (
        <table>
            <thead>
                <tr>
                    <th>Objectname</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr key={data['object']._id}>
                    <td>{data['object'].objectname}</td>
                    <td>
                        <button
                            onClick={() => navigate(`/objects/${data['object']._id}`)}
                        >Show Object</button>
                    </td>
                </tr>
            </tbody>
        </table>
    ) : (
        <p>There is no object to show ...</p>
    )}
    <h3>Tenant:</h3>
    {data['tenant'] ? (
        <table>
            <thead>
                <tr>
                    <th>Companyname</th>
                    <th>Object</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr key={data['tenant'].id}>
                    <td>{data['tenant'].companyname}</td>
                    {data['tenant'].object && (<td><Link to={`/objects/${data['tenant'].object.id}`}>{data['tenant'].object.objectname}</Link></td>)}
                    <td>
                        <button
                            onClick={() => navigate(`/tenants/${data['tenant'].id}`)}
                        >Show Tenant</button>
                    </td>
                </tr>
            </tbody>
        </table>
    ) : (
        <p>There is no tenant to show ...</p>
    )}
    </>
    );
  };

  return (
    <>
      {isLoggedIn && (
        <>
          {isAdmin ? renderAdminDashboard():renderUserDashboard()}
          <h3>Damages:</h3>
                {data['damages'].length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Object</th>
                                <th>Adress</th>
                                <th>Floor/Elevator</th>
                                <th>Remarks</th>
                                <th>Damage Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    <tbody>
                        {data['damages'].map((damage) => (
                            <tr key={damage.id}>
                                <td>{damage.title}</td>
                                <td>{damage.user.name}</td>
                                <td>{damage.object.objectname}</td>
                                <td>{damage.adress.adress}</td>
                                <td>{damage.floor}</td>
                                <td>{damage.remarks}</td>
                                <td>{damage.damageStatus}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/damages/${damage.id}`)}
                                    >Show Damage</button>
                                    {isAdmin && (<button
                                        onClick={() => navigate(`/damages/${damage.id}/edit`)}
                                    >Edit Damage</button>)}
                                    {isAdmin && (<button
                                        onClick={() => handleDeleteDamage(damage.id)}
                                    >Delete Damage</button>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (<p>There are no damages to show ...</p>)}
                <h3>Channels:</h3>
                {data['channels'].length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Channelname</th>
                                <th>Channelrights</th>
                                <th>Created By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data['channels'].map((channel) => (
                            <tr key={channel.id}>
                                <td>{channel.channelname}</td>
                                <td>{channel.channelrights}</td>
                                <td>{channel.createdBy.name}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/channels/${channel.id}`)}
                                    >Show Channel</button>
                                    <button
                                        onClick={() => navigate(`/channels/${channel.id}/edit`)}
                                    >Edit Channel</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (<p>There are no channels to show ...</p>)}

                <h3>Products:</h3>
                {data['products'].length > 0 ? (
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
                        {data['products'].map((product) => (
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
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (<p>There are no channels to show ...</p>)}
        </>
      )}
    </>
  );
};

