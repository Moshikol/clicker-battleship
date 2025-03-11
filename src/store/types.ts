export interface GridCell {
  id: string;
  x: number;
  y: number;
  hasShip: boolean;
  isHit: boolean;
  isShielded: boolean;
}

export interface Ship {
  id: string;
  size: number;
  health: number;
  position: {
    x: number;
    y: number;
    isHorizontal: boolean;
  };
}

export interface Player {
  id: string;
  name: string;
  grid: GridCell[][];
  ships: Ship[];
  isReady: boolean;
}

export interface GameState {
  resources: {
    coins: number;
    clicks: number;
    bombs: number;
    shields: number;
  };
  upgrades: {
    clickMultiplier: number;
    autoClickersCount: number;
    bombEfficiency: number;
    shieldStrength: number;
  };
  stats: {
    totalClicks: number;
    totalCoinsEarned: number;
    bombsLaunched: number;
    shieldsDeployed: number;
    hitsLanded: number;
    shipsSunk: number;
  };
  grid: {
    size: number;
    player: Player;
    opponent: Player | null;
    isPlayerTurn: boolean;
    gamePhase: 'setup' | 'battle' | 'ended';
    winner: string | null;
  };
}

export interface RootState {
  game: GameState;
} 