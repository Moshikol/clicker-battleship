import React, { useState, useEffect } from 'react';
import { getLeaderboard, getClicksLeaderboard, LeaderboardEntry } from '../../utils/storage';
import { useUser } from '../../context/UserContext';
import './Leaderboard.css';

type SortOption = 'score' | 'clicks';

const Leaderboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('clicks');
  const { user } = useUser();

  useEffect(() => {
    // Load leaderboard data based on sort option
    const data = sortBy === 'score' ? getLeaderboard() : getClicksLeaderboard();
    setLeaderboard(data);
  }, [sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Leaderboard 🏆</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="sort-options">
        <button 
          className={sortBy === 'clicks' ? 'active' : ''} 
          onClick={() => setSortBy('clicks')}
        >
          Sort by Clicks
        </button>
        <button 
          className={sortBy === 'score' ? 'active' : ''} 
          onClick={() => setSortBy('score')}
        >
          Sort by Score
        </button>
      </div>

      <div className="leaderboard-content">
        {leaderboard.length === 0 ? (
          <div className="no-data">No entries yet. Start clicking to be the first!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>{sortBy === 'clicks' ? 'Clicks' : 'Score'}</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr 
                  key={`${entry.userId}-${index}`} 
                  className={user && entry.userId === user.id ? 'current-user' : ''}
                >
                  <td className="rank">{index + 1}</td>
                  <td className="player-name">
                    {entry.playerName}
                    {user && entry.userId === user.id && <span className="you-badge">YOU</span>}
                  </td>
                  <td className="score">
                    {sortBy === 'clicks' ? entry.clicks.toLocaleString() : entry.score.toLocaleString()}
                  </td>
                  <td className="date">{formatDate(entry.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="leaderboard-footer">
        <p>Keep clicking to climb the ranks!</p>
      </div>
    </div>
  );
};

export default Leaderboard; 