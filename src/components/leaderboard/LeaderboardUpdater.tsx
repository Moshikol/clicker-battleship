import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useUser } from '../../context/UserContext';
import { saveToLeaderboard, calculateScore } from '../../utils/storage';

// This component doesn't render anything - it just listens for changes and updates the leaderboard
const LeaderboardUpdater: React.FC = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const { user } = useUser();

  // Update leaderboard when the game state or user changes
  useEffect(() => {
    if (!user) return;

    // Save to leaderboard
    saveToLeaderboard({
      userId: user.id,
      playerName: user.nickname,
      score: calculateScore(gameState),
      clicks: gameState.resources.clicks,
      date: new Date().toISOString(),
      shipsSunk: gameState.stats.shipsSunk,
      bombsLaunched: gameState.stats.bombsLaunched,
      hitsLanded: gameState.stats.hitsLanded
    });
  }, [
    gameState.resources.clicks,
    gameState.stats.shipsSunk,
    gameState.stats.bombsLaunched,
    gameState.stats.hitsLanded,
    user
  ]);

  return null;
};

export default LeaderboardUpdater; 