import React, { useState, useContext, useEffect } from 'react';
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
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Update the decorative time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      setCurrentDate(`${month}-${day}`);
    };
    
    // Initial update
    updateTime();
    
    // Set interval for updates
    const timeInterval = setInterval(updateTime, 1000);
    
    // Clean up on unmount
    return () => clearInterval(timeInterval);
  }, []);
  
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
    return stats.totalClicks.toString().padStart(6, '0');
  };
  
  // Render individual digits for the counter
  const renderDigits = () => {
    const formattedClicks = formatClickDisplay();
    return formattedClicks.split('').map((digit, index) => (
      <div 
        key={index} 
        className={styles.digitBox}
      >
        <span style={{ color: counterColor, textShadow: `0 0 10px ${counterColor}` }}>
          {digit}
        </span>
      </div>
    ));
  };
  
  return (
    <div className={styles.watchContainer}>
      <div className={styles.watchOuter}>
        <div className={styles.watchInner}>
          {/* Add left side buttons */}
          <div className={styles.leftButton1}></div>
          <div className={styles.leftButton2}></div>
          
          <div className={styles.watchFace}>
            <div className={styles.watchBrand}>CLICKER BATTLESHIP</div>
            
            {/* Add decorative time & date displays */}
            <div className={styles.watchTime}>{currentTime}</div>
            <div className={styles.watchDate}>{currentDate}</div>
            
            <div className={styles.counterSection}>
              <div 
                className={`${styles.watchDisplay} ${isWatchActive ? styles.active : ''}`}
              >
                {renderDigits()}
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
                <span className={styles.statLabel}>COINS</span>
                <span className={styles.statValue} style={{ 
                  color: counterColor,
                  textShadow: `0 0 5px ${counterColor}`
                }}>{resources.coins}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>BOMBS</span>
                <span className={styles.statValue} style={{ 
                  color: counterColor,
                  textShadow: `0 0 5px ${counterColor}`
                }}>{resources.bombs}</span>
              </div>
              <div className={styles.statItem}>
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
    </div>
  );
}; 