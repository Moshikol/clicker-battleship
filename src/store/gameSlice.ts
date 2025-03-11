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
      // ONLY increment total clicks counter by 1, nothing else
      state.stats.totalClicks = state.stats.totalClicks + 1;
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
    
    placeShip: (state, action: PayloadAction<{ shipId: string; x: number; y: number; isHorizontal: boolean }>) => {
      const { shipId, x, y, isHorizontal } = action.payload;
      const ship = state.grid.player.ships.find(s => s.id === shipId);
      
      if (!ship) return;
      
      // Check if placement is valid
      let canPlace = true;
      for (let i = 0; i < ship.size; i++) {
        const checkX = isHorizontal ? x + i : x;
        const checkY = isHorizontal ? y : y + i;
        
        // Check if out of bounds
        if (checkX >= state.grid.size || checkY >= state.grid.size) {
          canPlace = false;
          break;
        }
        
        // Check if cell already has a ship
        if (state.grid.player.grid[checkY][checkX].hasShip) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        // Remove ship from previous position if it was placed
        if (ship.position.x >= 0 && ship.position.y >= 0) {
          for (let i = 0; i < ship.size; i++) {
            const oldX = ship.position.isHorizontal ? ship.position.x + i : ship.position.x;
            const oldY = ship.position.isHorizontal ? ship.position.y : ship.position.y + i;
            
            if (oldX < state.grid.size && oldY < state.grid.size) {
              state.grid.player.grid[oldY][oldX].hasShip = false;
            }
          }
        }
        
        // Place the ship in new position
        ship.position = { x, y, isHorizontal };
        for (let i = 0; i < ship.size; i++) {
          const placeX = isHorizontal ? x + i : x;
          const placeY = isHorizontal ? y : y + i;
          state.grid.player.grid[placeY][placeX].hasShip = true;
        }
      }
    },
    
    rotateShip: (state, action: PayloadAction<{ shipId: string }>) => {
      const { shipId } = action.payload;
      const ship = state.grid.player.ships.find(s => s.id === shipId);
      
      if (!ship || ship.position.x < 0 || ship.position.y < 0) return;
      
      // Remove ship from current position
      for (let i = 0; i < ship.size; i++) {
        const oldX = ship.position.isHorizontal ? ship.position.x + i : ship.position.x;
        const oldY = ship.position.isHorizontal ? ship.position.y : ship.position.y + i;
        
        if (oldX < state.grid.size && oldY < state.grid.size) {
          state.grid.player.grid[oldY][oldX].hasShip = false;
        }
      }
      
      // Try to place in rotated position
      const newIsHorizontal = !ship.position.isHorizontal;
      const { x, y } = ship.position;
      
      // Check if rotation is valid
      let canRotate = true;
      for (let i = 0; i < ship.size; i++) {
        const checkX = newIsHorizontal ? x + i : x;
        const checkY = newIsHorizontal ? y : y + i;
        
        // Check if out of bounds
        if (checkX >= state.grid.size || checkY >= state.grid.size) {
          canRotate = false;
          break;
        }
        
        // Check if cell already has another ship
        if (state.grid.player.grid[checkY][checkX].hasShip) {
          canRotate = false;
          break;
        }
      }
      
      if (canRotate) {
        // Place the ship in rotated position
        ship.position.isHorizontal = newIsHorizontal;
        for (let i = 0; i < ship.size; i++) {
          const placeX = newIsHorizontal ? x + i : x;
          const placeY = newIsHorizontal ? y : y + i;
          state.grid.player.grid[placeY][placeX].hasShip = true;
        }
      } else {
        // If rotation is not valid, place back in original position
        for (let i = 0; i < ship.size; i++) {
          const placeX = ship.position.isHorizontal ? x + i : x;
          const placeY = ship.position.isHorizontal ? y : y + i;
          state.grid.player.grid[placeY][placeX].hasShip = true;
        }
      }
    },
    
    setPlayerReady: (state) => {
      // Check if all ships are placed
      const allShipsPlaced = state.grid.player.ships.every(
        ship => ship.position.x >= 0 && ship.position.y >= 0
      );
      
      if (allShipsPlaced) {
        state.grid.player.isReady = true;
        
        // If opponent is also ready, start the battle
        if (state.grid.opponent && state.grid.opponent.isReady) {
          state.grid.gamePhase = 'battle';
        } else if (!state.grid.opponent) {
          // Create an opponent if none exists
          gameSlice.caseReducers.startGame(state);
        }
      }
    },
    
    fireAtOpponent: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      
      if (
        !state.grid.opponent || 
        state.grid.gamePhase !== 'battle' || 
        !state.grid.isPlayerTurn ||
        state.grid.opponent.grid[y][x].isHit
      ) {
        return;
      }
      
      // Mark cell as hit
      state.grid.opponent.grid[y][x].isHit = true;
      
      // Check if hit a ship
      if (state.grid.opponent.grid[y][x].hasShip) {
        state.stats.hitsLanded += 1;
        
        // Find which ship was hit and reduce its health
        for (const ship of state.grid.opponent.ships) {
          const { position } = ship;
          let isShipHit = false;
          
          for (let i = 0; i < ship.size; i++) {
            const shipX = position.isHorizontal ? position.x + i : position.x;
            const shipY = position.isHorizontal ? position.y : position.y + i;
            
            if (shipX === x && shipY === y) {
              ship.health -= 1;
              isShipHit = true;
              break;
            }
          }
          
          if (isShipHit) {
            // Check if ship is sunk
            if (ship.health <= 0) {
              state.stats.shipsSunk += 1;
            }
            break;
          }
        }
        
        // Check if all opponent ships are sunk
        const allOpponentShipsSunk = state.grid.opponent.ships.every(ship => ship.health <= 0);
        if (allOpponentShipsSunk) {
          state.grid.gamePhase = 'ended';
          state.grid.winner = state.grid.player.name;
        }
      }
      
      // Switch turns
      state.grid.isPlayerTurn = false;
      
      // Simulate opponent's turn
      setTimeout(() => {
        gameSlice.caseReducers.opponentTurn(state);
      }, 1000);
    },
    
    opponentTurn: (state) => {
      if (
        !state.grid.opponent || 
        state.grid.gamePhase !== 'battle' || 
        state.grid.isPlayerTurn
      ) {
        return;
      }
      
      // Simple AI: randomly select a cell that hasn't been hit
      const unattackedCells: { x: number; y: number }[] = [];
      
      for (let y = 0; y < state.grid.size; y++) {
        for (let x = 0; x < state.grid.size; x++) {
          if (!state.grid.player.grid[y][x].isHit) {
            unattackedCells.push({ x, y });
          }
        }
      }
      
      if (unattackedCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * unattackedCells.length);
        const { x, y } = unattackedCells[randomIndex];
        
        // Mark cell as hit
        state.grid.player.grid[y][x].isHit = true;
        
        // Check if hit a ship and if it's shielded
        if (state.grid.player.grid[y][x].hasShip) {
          if (state.grid.player.grid[y][x].isShielded) {
            // Shield absorbs the hit
            state.grid.player.grid[y][x].isShielded = false;
          } else {
            // Find which ship was hit and reduce its health
            for (const ship of state.grid.player.ships) {
              const { position } = ship;
              let isShipHit = false;
              
              for (let i = 0; i < ship.size; i++) {
                const shipX = position.isHorizontal ? position.x + i : position.x;
                const shipY = position.isHorizontal ? position.y : position.y + i;
                
                if (shipX === x && shipY === y) {
                  ship.health -= 1;
                  isShipHit = true;
                  break;
                }
              }
              
              if (isShipHit) {
                break;
              }
            }
            
            // Check if all player ships are sunk
            const allPlayerShipsSunk = state.grid.player.ships.every(ship => ship.health <= 0);
            if (allPlayerShipsSunk) {
              state.grid.gamePhase = 'ended';
              state.grid.winner = state.grid.opponent.name;
            }
          }
        }
      }
      
      // Switch turns back to player
      state.grid.isPlayerTurn = true;
    },
    
    resetGame: (state) => {
      // Reset grid and ships but keep resources and upgrades
      state.grid = {
        ...initialState.grid,
        player: createPlayer(state.grid.player.name, initialState.grid.size),
      };
      state.stats.bombsLaunched = 0;
      state.stats.shieldsDeployed = 0;
      state.stats.hitsLanded = 0;
      state.stats.shipsSunk = 0;
    },

    // Phase 3: Reset Bomb and Defense Systems
    purchaseBomb: (state) => {
      const cost = 100;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.resources.bombs += 1;
      }
    },
    
    purchaseShield: (state) => {
      const cost = 50;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.resources.shields += 1;
      }
    },
    
    upgradeBombEfficiency: (state) => {
      const cost = state.upgrades.bombEfficiency * 200;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.upgrades.bombEfficiency += 1;
      }
    },
    
    upgradeShieldStrength: (state) => {
      const cost = state.upgrades.shieldStrength * 150;
      if (state.resources.coins >= cost) {
        state.resources.coins -= cost;
        state.upgrades.shieldStrength += 1;
      }
    },
    
    deployShield: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      
      if (
        state.resources.shields <= 0 ||
        state.grid.gamePhase !== 'battle' ||
        !state.grid.isPlayerTurn ||
        state.grid.player.grid[y][x].isShielded ||
        !state.grid.player.grid[y][x].hasShip
      ) {
        return;
      }
      
      // Deploy shield on the cell
      state.grid.player.grid[y][x].isShielded = true;
      state.resources.shields -= 1;
      state.stats.shieldsDeployed += 1;
    },
    
    launchResetBomb: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      
      if (
        !state.grid.opponent ||
        state.resources.bombs <= 0 ||
        state.grid.gamePhase !== 'battle' ||
        !state.grid.isPlayerTurn
      ) {
        return;
      }
      
      // Launch the reset bomb
      state.resources.bombs -= 1;
      state.stats.bombsLaunched += 1;
      
      // Calculate bomb impact radius based on efficiency
      const radius = state.upgrades.bombEfficiency;
      
      // Apply bomb effect to all cells within radius
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const targetX = x + dx;
          const targetY = y + dy;
          
          // Check if within grid bounds
          if (
            targetX >= 0 && 
            targetX < state.grid.size && 
            targetY >= 0 && 
            targetY < state.grid.size
          ) {
            // Mark cell as hit
            state.grid.opponent.grid[targetY][targetX].isHit = true;
            
            // Check if hit a ship
            if (state.grid.opponent.grid[targetY][targetX].hasShip) {
              state.stats.hitsLanded += 1;
              
              // Find which ship was hit and reduce its health
              for (const ship of state.grid.opponent.ships) {
                const { position } = ship;
                let isShipHit = false;
                
                for (let i = 0; i < ship.size; i++) {
                  const shipX = position.isHorizontal ? position.x + i : position.x;
                  const shipY = position.isHorizontal ? position.y : position.y + i;
                  
                  if (shipX === targetX && shipY === targetY) {
                    // Reset bombs do double damage
                    ship.health -= 2;
                    isShipHit = true;
                    break;
                  }
                }
                
                if (isShipHit) {
                  // Check if ship is sunk
                  if (ship.health <= 0) {
                    state.stats.shipsSunk += 1;
                  }
                  break;
                }
              }
            }
          }
        }
      }
      
      // Check if all opponent ships are sunk
      const allOpponentShipsSunk = state.grid.opponent.ships.every(ship => ship.health <= 0);
      if (allOpponentShipsSunk) {
        state.grid.gamePhase = 'ended';
        state.grid.winner = state.grid.player.name;
      }
      
      // Switch turns
      state.grid.isPlayerTurn = false;
      
      // Simulate opponent's turn
      setTimeout(() => {
        gameSlice.caseReducers.opponentTurn(state);
      }, 1000);
    },
    
    rebuildShip: (state, action: PayloadAction<{ shipId: string }>) => {
      const { shipId } = action.payload;
      const ship = state.grid.player.ships.find(s => s.id === shipId);
      
      if (!ship || ship.health === ship.size) return;
      
      const costPerHealthPoint = 50;
      const healthNeeded = ship.size - ship.health;
      const totalCost = healthNeeded * costPerHealthPoint;
      
      if (state.resources.coins >= totalCost) {
        state.resources.coins -= totalCost;
        ship.health = ship.size;
      }
    },

    setCounterColor: (state, action: PayloadAction<string>) => {
      // Ensure we're setting a valid color
      const newColor = action.payload;
      console.log('Setting counter color to:', newColor);
      state.counterColor = newColor;
    },
  },
});

export const { 
  click, 
  earnCoins, 
  purchaseClickMultiplier, 
  purchaseAutoClicker, 
  autoClickTick,
  startGame,
  placeShip,
  rotateShip,
  setPlayerReady,
  fireAtOpponent,
  resetGame,
  purchaseBomb,
  purchaseShield,
  upgradeBombEfficiency,
  upgradeShieldStrength,
  deployShield,
  launchResetBomb,
  rebuildShip,
  setCounterColor
} = gameSlice.actions;
export default gameSlice.reducer; 