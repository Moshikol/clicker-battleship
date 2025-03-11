import React, { useContext } from 'react';
import { Clicker } from '../clicker/Clicker';
import { GameBoard } from './GameBoard';
import { Leaderboard } from '../ui/Leaderboard';
import { NavigationContext } from '../../App';
import styles from './Game.module.css';

export const Game: React.FC = () => {
  const { navigateTo } = useContext(NavigationContext);
  
  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <h1>Clicker Battleship</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigateTo('watch')}
        >
          Back to Watch
        </button>
      </div>
      
      <div className={styles.content}>
        <Clicker />
        <GameBoard />
        <Leaderboard />
      </div>
    </div>
  );
}; 