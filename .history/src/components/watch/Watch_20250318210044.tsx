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
      <div className={`${styles.watch} ${isWatchActive ? styles.active : ''}`}>
        <div className={styles.watchface} onClick={handleWatchClick}>
          <div className={styles.clockHands}>
            <div className={styles.hourHand}></div>
            <div className={styles.minuteHand}></div>
            <div className={styles.secondHand}></div>
          </div>
          <div className={styles.clickCounter} style={{ color: counterColor }}>
            {formatClickDisplay()}
          </div>
        </div>
        <div className={styles.watchControls}>
          <button 
            className={styles.gameButton}
            onClick={() => navigateTo('game')}
          >
            Enter Game
          </button>
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