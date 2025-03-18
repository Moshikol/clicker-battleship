import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './UserLogin.css';

const UserLogin: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.trim().length < 3) {
      setError('Nickname must be at least 3 characters');
      return;
    }
    
    if (nickname.trim().length > 15) {
      setError('Nickname must be less than 15 characters');
      return;
    }
    
    // Clear any previous error
    setError('');
    
    // Login the user
    login(nickname.trim());
    
    // Close the dialog if a close handler was provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="user-login-container">
      <h2>Welcome to Clicker Bomber!</h2>
      <p>Enter a nickname to start playing and climb the leaderboard</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <button type="submit" className="login-button">
          Start Playing
        </button>
      </form>
      
      <div className="login-footer">
        <p>Your progress will be saved automatically</p>
      </div>
    </div>
  );
};

export default UserLogin; 