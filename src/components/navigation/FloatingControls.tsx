import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import UserProfile from '../user/UserProfile';
import UserLogin from '../user/UserLogin';
import Leaderboard from '../leaderboard/Leaderboard';
import './FloatingControls.css';

const FloatingControls: React.FC = () => {
  const { isLoggedIn, user } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      {/* Leaderboard Button */}
      <div className="floating-icon leaderboard-icon" onClick={() => setShowLeaderboard(true)} title="Leaderboard">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="16" rx="2" ry="2"></rect>
          <line x1="16" y1="3" x2="16" y2="7"></line>
          <line x1="8" y1="3" x2="8" y2="7"></line>
          <line x1="4" y1="11" x2="20" y2="11"></line>
          <line x1="10" y1="16" x2="14" y2="16"></line>
        </svg>
      </div>

      {/* User Button (Login or Profile) */}
      {isLoggedIn ? (
        <div className="floating-icon user-icon" onClick={() => setShowProfile(true)} title={user?.nickname || 'Profile'}>
          <div className="mini-avatar">{user?.nickname.charAt(0).toUpperCase()}</div>
        </div>
      ) : (
        <div className="floating-icon login-icon" onClick={() => setShowLogin(true)} title="Login">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"></path>
          </svg>
        </div>
      )}

      {/* Modals */}
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

      {showProfile && isLoggedIn && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>My Profile</h3>
              <button className="close-button" onClick={() => setShowProfile(false)}>×</button>
            </div>
            <div className="profile-modal-content">
              <UserProfile />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingControls; 