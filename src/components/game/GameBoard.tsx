import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { resetGame } from '../../store/gameSlice';
import { ShipPlacement } from '../grid/ShipPlacement';
import { Grid } from '../grid/Grid';
import { calculateScore, saveToLeaderboard } from '../../utils/storage';
import { useUser } from '../../context/UserContext';
import styles from './GameBoard.module.css';

export const GameBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { grid, stats, resources } = useSelector((state: RootState) => state.game);
  const { user } = useUser();
  
  const handlePlayAgain = () => {
    // Save to leaderboard if game is ended
    if (grid.gamePhase === 'ended' && grid.winner) {
      const gameState = useSelector((state: RootState) => state.game);
      const score = calculateScore(gameState);
      
      saveToLeaderboard({
        userId: user?.id || 'anonymous',
        playerName: user?.nickname || grid.winner,
        score,
        clicks: resources.clicks,
        date: new Date().toISOString(),
        shipsSunk: stats.shipsSunk,
        bombsLaunched: stats.bombsLaunched,
        hitsLanded: stats.hitsLanded,
      });
    }
    
    dispatch(resetGame());
  };
  
  const renderGamePhase = () => {
    switch (grid.gamePhase) {
      case 'setup':
        return <ShipPlacement />;
      
      case 'battle':
        return (
          <div className={styles.battleContainer}>
            <div className={styles.grids}>
              <Grid isOpponent={false} />
              <Grid isOpponent={true} />
            </div>
            <div className={styles.battleStatus}>
              <h3>Battle Status</h3>
              <p>Turn: {grid.isPlayerTurn ? 'Your Turn' : "Opponent's Turn"}</p>
              <p>Hits Landed: {stats.hitsLanded}</p>
              <p>Ships Sunk: {stats.shipsSunk}</p>
            </div>
          </div>
        );
      
      case 'ended':
        return (
          <div className={styles.gameOverContainer}>
            <h2>Game Over</h2>
            <p className={styles.winner}>{grid.winner} wins!</p>
            <div className={styles.gameStats}>
              <h3>Game Statistics</h3>
              <p>Hits Landed: {stats.hitsLanded}</p>
              <p>Ships Sunk: {stats.shipsSunk}</p>
              <p>Bombs Launched: {stats.bombsLaunched}</p>
              <p>Shields Deployed: {stats.shieldsDeployed}</p>
              <p>Score: {calculateScore(useSelector((state: RootState) => state.game))}</p>
            </div>
            <button className={styles.playAgainButton} onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        );
      
      default:
        return <div>Loading game...</div>;
    }
  };
  
  return (
    <div className={styles.container}>
      {renderGamePhase()}
    </div>
  );
}; 