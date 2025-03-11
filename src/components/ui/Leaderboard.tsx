import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../../utils/storage';
import styles from './Leaderboard.module.css';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // Load leaderboard data
    const data = getLeaderboard();
    setLeaderboard(data);
  }, []);
  
  if (leaderboard.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Leaderboard</h2>
        <p className={styles.emptyMessage}>No entries yet. Be the first to make the leaderboard!</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <h2>Leaderboard</h2>
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Ships Sunk</th>
            <th>Hits</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={`${entry.playerName}-${entry.date}`}>
              <td>{index + 1}</td>
              <td>{entry.playerName}</td>
              <td>{entry.score}</td>
              <td>{entry.shipsSunk}</td>
              <td>{entry.hitsLanded}</td>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 