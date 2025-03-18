import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import UserProfile from '../user/UserProfile';
import UserLogin from '../user/UserLogin';
import Leaderboard from '../leaderboard/Leaderboard';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { isLoggedIn } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="navigation">
      <div className="nav-left">
        <h1 className="game-title">Clicker Bomber</h1>
      </div>
      
      <div className="nav-right">
        <button 
          className="leaderboard-icon" 
          onClick={() => setShowLeaderboard(true)}
          title="Leaderboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="16" rx="2" ry="2"></rect>
            <line x1="16" y1="3" x2="16" y2="7"></line>
            <line x1="8" y1="3" x2="8" y2="7"></line>
            <line x1="4" y1="11" x2="20" y2="11"></line>
            <line x1="10" y1="16" x2="14" y2="16"></line>
          </svg>
        </button>
        
        {isLoggedIn ? (
          <UserProfile />
        ) : (
          <button 
            className="login-button" 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}
      </div>

      {showLogin && !isLoggedIn && (
        <div className="modal-overlay">
          <UserLogin onClose={() => setShowLogin(false)} />
        </div>
      )}

      {showLeaderboard && (
        <div className="modal-overlay">
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        </div>
      )}
    </div>
  );
};

export default Navigation; 