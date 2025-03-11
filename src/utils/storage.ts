import { GameState } from '../store/types';

const STORAGE_KEY = 'clicker_battleship_game_state';
const LEADERBOARD_KEY = 'clicker_battleship_leaderboard';

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  date: string;
  shipsSunk: number;
  bombsLaunched: number;
  hitsLanded: number;
}

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const saveToLeaderboard = (entry: LeaderboardEntry): void => {
  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(entry);
    
    // Sort by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 entries
    const topEntries = leaderboard.slice(0, 10);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  } catch (error) {
    console.error('Failed to save to leaderboard:', error);
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const leaderboard = localStorage.getItem(LEADERBOARD_KEY);
    if (leaderboard) {
      return JSON.parse(leaderboard);
    }
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
  }
  return [];
};

export const calculateScore = (state: GameState): number => {
  // Calculate score based on various factors
  const resourceScore = state.resources.coins * 0.1;
  const upgradeScore = 
    state.upgrades.clickMultiplier * 50 + 
    state.upgrades.autoClickersCount * 100 +
    state.upgrades.bombEfficiency * 200 +
    state.upgrades.shieldStrength * 150;
  const statsScore = 
    state.stats.hitsLanded * 20 + 
    state.stats.shipsSunk * 100 -
    state.stats.bombsLaunched * 5;
  
  return Math.floor(resourceScore + upgradeScore + statsScore);
}; 