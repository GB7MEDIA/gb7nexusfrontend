import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import "../css/header.css"

export const Header = ({ isAdmin, currentUserId, currentUser, handleLogout }) => {
  const [isUsersDropdownVisible, setIsUsersDropdownVisible] = useState(false);
  const [isObjectsDropdownVisible, setIsObjectsDropdownVisible] = useState(false);
  const [isTenantsDropdownVisible, setIsTenantsDropdownVisible] = useState(false);
  const [isDamagesDropdownVisible, setIsDamagesDropdownVisible] = useState(false);
  const [isChatsDropdownVisible, setIsChatsDropdownVisible] = useState(false);
  const [isChannelsDropdownVisible, setIsChannelsDropdownVisible] = useState(false);
  const [isProductsDropdownVisible, setIsProductsDropdownVisible] = useState(false);
  const [isCurrentUserDropdownVisible, setIsCurrentUserDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }

  const toggleUsersDropdown = () => {
    setIsUsersDropdownVisible(!isUsersDropdownVisible);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleObjectsDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(!isObjectsDropdownVisible);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleTenantsDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(!isTenantsDropdownVisible);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleDamagesDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(!isDamagesDropdownVisible);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleChatsDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(!isChatsDropdownVisible);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleChannelsDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(!isChannelsDropdownVisible);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleProductsDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(!isProductsDropdownVisible);
    setIsCurrentUserDropdownVisible(false);
  }
  const toggleCurrentUserDropdown = () => {
    setIsUsersDropdownVisible(false);
    setIsObjectsDropdownVisible(false);
    setIsTenantsDropdownVisible(false);
    setIsDamagesDropdownVisible(false);
    setIsChatsDropdownVisible(false);
    setIsChannelsDropdownVisible(false);
    setIsProductsDropdownVisible(false);
    setIsCurrentUserDropdownVisible(!isCurrentUserDropdownVisible);
  }

  return (
    <header>
      <Link onClick={toggleDropdown} to="/">Dashboard</Link>

      <Link to="/upload">Upload</Link>
      
      {isAdmin && (
        <div style={{ position: 'relative' }}>
          <div onClick={toggleUsersDropdown}>Users ▼</div>
          <div className={`dropdown ${isUsersDropdownVisible ? 'visible' : ''}`}>
            <Link to="/users" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>Users</Link>
            <Link to="/users/create" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>Create User</Link>
          </div>
        </div>
      )}

      {isAdmin && (
        <div style={{ position: 'relative' }}>
          <div onClick={toggleObjectsDropdown}>Objects ▼</div>
          <div className={`dropdown ${isObjectsDropdownVisible ? 'visible' : ''}`}>
            <Link to="/objects">Objects</Link>
            <Link to="/objects/create">Create Object</Link>
          </div>
        </div>
      )}

      {isAdmin && (
        <div style={{ position: 'relative' }}>
          <div onClick={toggleTenantsDropdown}>Tenants ▼</div>
          <div className={`dropdown ${isTenantsDropdownVisible ? 'visible' : ''}`}>
            <Link to="/tenants">Tenants</Link>
            <Link to="/tenants/create">Create Tenant</Link>
          </div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <div onClick={toggleDamagesDropdown}>Damages ▼</div>
        <div className={`dropdown ${isDamagesDropdownVisible ? 'visible' : ''}`}>
          <Link to="/damages">Damages</Link>
          <Link to="/damages/create">Create Damage</Link>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div onClick={toggleChatsDropdown}>Chats ▼</div>
        <div className={`dropdown ${isChatsDropdownVisible ? 'visible' : ''}`}>
          <Link to="/chats">Chats</Link>
          <Link to="/chats/create">Create Chat</Link>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div onClick={toggleChannelsDropdown}>Channels ▼</div>
        <div className={`dropdown ${isChannelsDropdownVisible ? 'visible' : ''}`}>
          <Link to="/channels">Channels</Link>
          {isAdmin && (<Link to="/channels/create">Create Channel</Link>)}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div onClick={toggleProductsDropdown}>Products ▼</div>
        <div className={`dropdown ${isProductsDropdownVisible ? 'visible' : ''}`}>
          <Link to="/products">Products</Link>
          <Link to="/products/create">Create Product</Link>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div onClick={toggleCurrentUserDropdown}>{currentUser.name} ▼</div>
        <div className={`dropdown ${isCurrentUserDropdownVisible ? 'visible' : ''}`}>
          <Link to={`/${currentUserId}`}>{currentUser.name}</Link>
          <Link to="/settings">Settings</Link>
          <Link onClick={e => handleLogout(e)}>Logout</Link>
        </div>
      </div>
    </header>
  );
};
