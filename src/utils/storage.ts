import { GameState } from '../store/types';

const STORAGE_KEY_PREFIX = 'clicker_battleship_game_state_';
const LEADERBOARD_KEY = 'clicker_battleship_leaderboard';

export interface LeaderboardEntry {
  userId: string;
  playerName: string;
  score: number;
  clicks: number;
  date: string;
  shipsSunk: number;
  bombsLaunched: number;
  hitsLanded: number;
}

export const saveGameState = (state: GameState, userId?: string): void => {
  try {
    const storageKey = userId 
      ? `${STORAGE_KEY_PREFIX}${userId}` 
      : `${STORAGE_KEY_PREFIX}anonymous`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (userId?: string): GameState | null => {
  try {
    const storageKey = userId 
      ? `${STORAGE_KEY_PREFIX}${userId}` 
      : `${STORAGE_KEY_PREFIX}anonymous`;
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

export const clearGameState = (userId?: string): void => {
  try {
    const storageKey = userId 
      ? `${STORAGE_KEY_PREFIX}${userId}` 
      : `${STORAGE_KEY_PREFIX}anonymous`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const saveToLeaderboard = (entry: LeaderboardEntry): void => {
  try {
    const leaderboard = getLeaderboard();
    
    // Check if user already has an entry
    const existingEntryIndex = leaderboard.findIndex(e => e.userId === entry.userId);
    
    if (existingEntryIndex !== -1) {
      // Update existing entry if new score is higher
      if (entry.score > leaderboard[existingEntryIndex].score) {
        leaderboard[existingEntryIndex] = entry;
      }
    } else {
      // Add new entry
      leaderboard.push(entry);
    }
    
    // Sort by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 20 entries
    const topEntries = leaderboard.slice(0, 20);
    
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

// Get leaderboard sorted by total clicks
export const getClicksLeaderboard = (): LeaderboardEntry[] => {
  try {
    const leaderboard = getLeaderboard();
    return [...leaderboard].sort((a, b) => b.clicks - a.clicks);
  } catch (error) {
    console.error('Failed to get clicks leaderboard:', error);
    return [];
  }
}; 