import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GridCell, Ship, Player } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const createEmptyGrid = (size: number): GridCell[][] => {
  const grid: GridCell[][] = [];
  for (let y = 0; y < size; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        id: `cell-${x}-${y}`,
        x,
        y,
        hasShip: false,
        isHit: false,
        isShielded: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

const createDefaultShips = (): Ship[] => {
  return [
    {
      id: uuidv4(),
      size: 5,
      health: 5,
      position: { x: -1, y: -1, isHorizontal: true },
    },
    {
      id: uuidv4(),
      size: 4,
      health: 4,
      position: { x: -1, y: -1, isHorizontal: true },
    },
    {
      id: uuidv4(),
      size: 3,
      health: 3,
      position: { x: -1, y: -1, isHorizontal: true },
    },
    {
      id: uuidv4(),
      size: 3,
      health: 3,
      position: { x: -1, y: -1, isHorizontal: true },
    },
    {
      id: uuidv4(),
      size: 2,
      health: 2,
      position: { x: -1, y: -1, isHorizontal: true },
    },
  ];
};

const createPlayer = (name: string, gridSize: number): Player => {
  return {
    id: uuidv4(),
    name,
    grid: createEmptyGrid(gridSize),
    ships: createDefaultShips(),
    isReady: false,
  };
};

const initialState: GameState = {
  resources: {
    coins: 0,
    clicks: 0,
    bombs: 0,
    shields: 10,
  },
  upgrades: {
    clickMultiplier: 1,
    autoClickersCount: 0,
    bombEfficiency: 1,
    shieldStrength: 1,
  },
  stats: {
    totalClicks: 0,
    totalCoinsEarned: 0,
    bombsLaunched: 0,
    shieldsDeployed: 0,
    hitsLanded: 0,
    shipsSunk: 0,
  },
  grid: {
    size: 10,
    player: createPlayer('Player', 10),
    opponent: null,
    isPlayerTurn: true,
    gamePhase: 'setup',
    winner: null,
  },
  counterColor: '#FFFFFF', // Default color is white
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Phase 1: Clicker Mechanics
    click: (state) => {
      // Increment total clicks counter by 1
      state.stats.totalClicks += 1;
      // Also increment resources clicks for easier access
      state.resources.clicks += 1;
    },
    earnCoins: (state) => {
      const coinsEarned = state.upgrades.clickMultiplier;
      state.resources.coins += coinsEarned;
      state.stats.totalCoinsEarned += coinsEarned;
    },
    purchaseClickMultiplier: (state) => {
      const cost = state.upgrades.clickMultiplier * 10;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.upgrades.clickMultiplier += 1;
      }
    },
    purchaseAutoClicker: (state) => {
      const cost = (state.upgrades.autoClickersCount + 1) * 50;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.upgrades.autoClickersCount += 1;
      }
    },
    autoClickTick: (state) => {
      const coinsEarned = state.upgrades.autoClickersCount * state.upgrades.clickMultiplier;
      state.resources.coins += coinsEarned;
      state.stats.totalCoinsEarned += coinsEarned;
      
      // Chance to earn bombs based on auto-clickers (0.5% chance per auto-clicker per tick)
      if (state.upgrades.autoClickersCount > 0 && Math.random() < 0.005 * state.upgrades.autoClickersCount) {
        state.resources.bombs += 1;
      }
    },

    // Phase 2: Grid System
    startGame: (state) => {
      // Create an opponent with random ship placements
      const opponent = createPlayer('Computer', state.grid.size);
      
      // Randomly place ships for the opponent
      opponent.ships.forEach(ship => {
        let placed = false;
        while (!placed) {
          const isHorizontal = Math.random() > 0.5;
          const maxX = isHorizontal ? state.grid.size - ship.size : state.grid.size - 1;
          const maxY = isHorizontal ? state.grid.size - 1 : state.grid.size - ship.size;
          
          const x = Math.floor(Math.random() * (maxX + 1));
          const y = Math.floor(Math.random() * (maxY + 1));
          
          // Check if placement is valid
          let canPlace = true;
          for (let i = 0; i < ship.size; i++) {
            const checkX = isHorizontal ? x + i : x;
            const checkY = isHorizontal ? y : y + i;
            
            if (opponent.grid[checkY][checkX].hasShip) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            // Place the ship
            ship.position = { x, y, isHorizontal };
            for (let i = 0; i < ship.size; i++) {
              const placeX = isHorizontal ? x + i : x;
              const placeY = isHorizontal ? y : y + i;
              opponent.grid[placeY][placeX].hasShip = true;
            }
            placed = true;
          }
        }
      });
      
      opponent.isReady = true;
      state.grid.opponent = opponent;
      state.grid.gamePhase = 'battle';
    },
    
    // Other actions will be implemented as needed
    
    setCounterColor: (state, action: PayloadAction<string>) => {
      state.counterColor = action.payload;
    },
    
    resetGame: (state) => {
      return initialState;
    },

    purchaseBomb: (state) => {
      if (state.resources.coins >= 50) {
        state.resources.coins -= 50;
        state.resources.bombs += 1;
      }
    },

    purchaseShield: (state) => {
      if (state.resources.coins >= 200) {
        state.resources.coins -= 200;
        state.resources.shields += 1;
      }
    }
  },
});

export const { 
  click, 
  earnCoins, 
  purchaseClickMultiplier, 
  purchaseAutoClicker, 
  autoClickTick,
  startGame,
  setCounterColor,
  resetGame,
  purchaseBomb,
  purchaseShield
} = gameSlice.actions;

export default gameSlice.reducer; 