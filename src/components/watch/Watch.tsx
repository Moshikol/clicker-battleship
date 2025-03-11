import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { click, earnCoins } from '../../store/gameSlice';
import { NavigationContext } from '../../App';
import styles from './Watch.module.css';

export const Watch: React.FC = () => {
  const dispatch = useDispatch();
  const { resources, stats, counterColor } = useSelector((state: RootState) => state.game);
  const { navigateTo } = useContext(NavigationContext);
  const [isWatchActive, setIsWatchActive] = useState(false);
  
  // Handle the click on the watch button
  const handleWatchClick = () => {
    dispatch(click());
    
    // Visual feedback - briefly activate the watch
    setIsWatchActive(true);
    setTimeout(() => setIsWatchActive(false), 200);
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
            </div>
          </div>
        </div>
        <div className={styles.watchStrap}></div>
      </div>
      <div className={styles.gameNav}>
        <button 
          className={styles.navButton} 
          onClick={() => navigateTo('game')}
        >
          ENTER GAME
        </button>
      </div>
    </div>
  );
}; 