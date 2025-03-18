import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { user, logout, updateNickname } = useUser();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [error, setError] = useState('');

  const handleStartEditing = () => {
    if (user) {
      setNewNickname(user.nickname);
      setIsEditingNickname(true);
      setError('');
    }
  };

  const handleSaveNickname = () => {
    if (newNickname.trim().length < 3) {
      setError('Nickname must be at least 3 characters');
      return;
    }
    
    if (newNickname.trim().length > 15) {
      setError('Nickname must be less than 15 characters');
      return;
    }

    updateNickname(newNickname.trim());
    setIsEditingNickname(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <div className="compact-profile">
      {isEditingNickname ? (
        <div className="edit-nickname">
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <div className="edit-actions">
            <button onClick={() => setIsEditingNickname(false)}>Cancel</button>
            <button onClick={handleSaveNickname}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-info">
            <div className="profile-header">
              <div className="avatar">{user.nickname.charAt(0).toUpperCase()}</div>
              <span className="nickname">{user.nickname}</span>
            </div>
            <button className="edit-button" onClick={handleStartEditing}>
              Edit Nickname
            </button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default UserProfile; 