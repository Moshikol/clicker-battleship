import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { click, earnCoins } from '../../store/gameSlice';
import { NavigationContext } from '../../App';
import { useMobile } from '../../context/MobileContext';
import styles from './Watch.module.css';

export const Watch: React.FC = () => {
  const dispatch = useDispatch();
  const { resources, stats, counterColor } = useSelector((state: RootState) => state.game);
  const { navigateTo } = useContext(NavigationContext);
  const [isWatchActive, setIsWatchActive] = useState(false);
  const { isMobile, vibrate } = useMobile();
  
  // Handle the click on the watch button
  const handleWatchClick = () => {
    dispatch(click());
    dispatch(earnCoins());
    
    // Visual feedback - briefly activate the watch
    setIsWatchActive(true);
    setTimeout(() => setIsWatchActive(false), 200);
    
    // Provide vibration feedback on mobile devices
    if (isMobile) {
      vibrate(50);
    }
  };
  
  // Format the click counter display
  const formatClickDisplay = () => {
    console.log('Current total clicks:', stats.totalClicks);
    return stats.totalClicks.toString().padStart(5, '0');
  };
  
  return (
    <div className={styles.watchContainer}>
      <div className={styles.watchOuter}>
        <div className={styles.watchInner}>
          <div className={styles.watchFace}>
            <div className={styles.watchBrand}>CLICKER BATTLESHIP</div>
            
            <div className={styles.counterSection}>
              <div 
                className={`${styles.watchDisplay} ${isWatchActive ? styles.active : ''}`}
                style={{ 
                  color: counterColor,
                  textShadow: `0 0 10px ${counterColor}`
                }}
              >
                {formatClickDisplay()}
              </div>
              
              <button 
                className={`${styles.watchButton} ${styles.clickButton}`}
                onClick={handleWatchClick}
              >
                CLICK ME
              </button>
            </div>
            
            <div className={styles.watchStats}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#F1C40F" />
                    <text x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#111">$</text>
                  </svg>
                </div>
                <span className={styles.statLabel}>COINS</span>
                <span className={styles.statValue} style={{ 
                  color: counterColor,
                  textShadow: `0 0 5px ${counterColor}`
                }}>{resources.coins}</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="14" r="6" fill="#333" />
                    <path d="M12 8V5" stroke="#ff5252" />
                    <path d="M15 10L17 8" stroke="#ff5252" />
                    <path d="M9 10L7 8" stroke="#ff5252" />
                  </svg>
                </div>
                <span className={styles.statLabel}>BOMBS</span>
                <span className={styles.statValue} style={{ 
                  color: counterColor,
                  textShadow: `0 0 5px ${counterColor}`
                }}>{resources.bombs}</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20s-6-3-6-8.5V6l6-2 6 2v5.5c0 5.5-6 8.5-6 8.5z" fill="#3498db" stroke="#2980b9" />
                    <path d="M12 12l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="#ffffff" stroke="none" />
                  </svg>
                </div>
                <span className={styles.statLabel}>SHIELDS</span>
                <span className={styles.statValue} style={{ 
                  color: counterColor,
                  textShadow: `0 0 5px ${counterColor}`
                }}>{resources.shields}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isMobile && (
        <div className={styles.mobileHint}>
          <p>Tip: Use the volume down button to click!</p>
        </div>
      )}
    </div>
  );
}; 