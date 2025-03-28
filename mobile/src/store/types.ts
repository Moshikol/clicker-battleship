// Define all types for the game state

export interface Resources {
  coins: number;
  clicks: number;
  bombs: number;
  shields: number;
}

export interface Upgrades {
  clickMultiplier: number;
  autoClickersCount: number;
  bombEfficiency: number;
  shieldStrength: number;
}

export interface Stats {
  totalClicks: number;
  totalCoinsEarned: number;
  bombsLaunched: number;
  shieldsDeployed: number;
  hitsLanded: number;
  shipsSunk: number;
}

export interface GridCell {
  id: string;
  x: number;
  y: number;
  hasShip: boolean;
  isHit: boolean;
  isShielded: boolean;
}

export interface ShipPosition {
  x: number;
  y: number;
  isHorizontal: boolean;
}

export interface Ship {
  id: string;
  size: number;
  health: number;
  position: ShipPosition;
}

export interface Player {
  id: string;
  name: string;
  grid: GridCell[][];
  ships: Ship[];
  isReady: boolean;
}

export interface Grid {
  size: number;
  player: Player;
  opponent: Player | null;
  isPlayerTurn: boolean;
  gamePhase: 'setup' | 'battle' | 'gameover';
  winner: string | null;
}

export interface GameState {
  resources: Resources;
  upgrades: Upgrades;
  stats: Stats;
  grid: Grid;
  counterColor: string;
} 