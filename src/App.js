import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';

import { 
  LoginScreen, RegisterScreen, ForgotPasswordScreen, NewPasswordScreen, ActivateAccountScreen, TwoFactorAuthenticationScreen,
  CreateUserScreen, EditUserScreen, UsersScreen, ProfileScreen, SettingsScreen,
  CreateObjectScreen, EditObjectScreen, ObjectsScreen, ObjectDetailScreen,
  CreateTenantScreen, EditTenantScreen, TenantsScreen, TenantDetailScreen,
  CreateDamageScreen, EditDamageScreen, DamagesScreen, DamageDetailScreen,
  CreateChatScreen, EditChatScreen, ChatsScreen, ChatDetailScreen,
  CreateChannelScreen, EditChannelScreen, ChannelsScreen, ChannelDetailScreen,
  CreateProductScreen, EditProductScreen, ProductsScreen, ProductDetailScreen,
  DashboardScreen,
  TestScreen
} from "./screens/index";

import { Header } from "./components/header";

import { isLoggedInAPI } from "./axios/auth";
import { getUserByIdAPI } from "./axios/user";

export const App = () => {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    (async () => {
      if (!isLoggedIn) {
        const response = await isLoggedInAPI();
        if (response.success === true) {
          setIsLoggedIn(response.data.response.data.loggedIn);
          setIsAdmin(response.data.response.data.admin);
          setCurrentUserId(response.data.response.data.loggedInUserId);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (currentUserId) {
        const response = await getUserByIdAPI(currentUserId);
        setCurrentUser(response.data.data.user);
      }
    })();
}, [currentUserId, setCurrentUser]);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {isLoggedIn && (
        <Header isAdmin={isAdmin} currentUserId={currentUserId} currentUser={currentUser} handleLogout={handleLogout} />
      )}
      <Routes>
      <Route path="/login" element={<LoginScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
      <Route path="/register" element={<RegisterScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/password/forgot" element={<ForgotPasswordScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/password/new" element={<NewPasswordScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/activate" element={<ActivateAccountScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/tfa" element={<TwoFactorAuthenticationScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />

      <Route path="/users/create" element={<CreateUserScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/users/:userId/edit" element={<EditUserScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />
      <Route path="/users" element={<UsersScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />
      <Route path="/:userId" element={<ProfileScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
      <Route path="/settings" element={<SettingsScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} currentUser={currentUser} />} />

      <Route path="/objects/create" element={<CreateObjectScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/objects/:objectId/edit" element={<EditObjectScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/objects" element={<ObjectsScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/objects/:objectId" element={<ObjectDetailScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />

      <Route path="/tenants/create" element={<CreateTenantScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/tenants/:tenantId/edit" element={<EditTenantScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/tenants" element={<TenantsScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/tenants/:tenantId" element={<TenantDetailScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />

      <Route path="/damages/create" element={<CreateDamageScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />
      <Route path="/damages/:damageId/edit" element={<EditDamageScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/damages" element={<DamagesScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />
      <Route path="/damages/:damageId" element={<DamageDetailScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />

      <Route path="/chats/create" element={<CreateChatScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/chats/:chatId/edit" element={<EditChatScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/chats" element={<ChatsScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />
      <Route path="/chats/:chatId" element={<ChatDetailScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />

      <Route path="/channels/create" element={<CreateChannelScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
      <Route path="/channels/:channelId/edit" element={<EditChannelScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />
      <Route path="/channels" element={<ChannelsScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />
      <Route path="/channels/:channelId" element={<ChannelDetailScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />

      <Route path="/products/create" element={<CreateProductScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/products/:productId/edit" element={<EditProductScreen isLoggedIn={isLoggedIn} />} />
      <Route path="/products" element={<ProductsScreen isLoggedIn={isLoggedIn} currentUserId={currentUserId} />} />
      <Route path="/products/:productId" element={<ProductDetailScreen isLoggedIn={isLoggedIn} />} />
      
      <Route path="/" element={<DashboardScreen isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentUserId={currentUserId} />} />

      <Route path="/upload" element={<TestScreen isLoggedIn={isLoggedIn} />} />
    </Routes>
    </>
  );
};


