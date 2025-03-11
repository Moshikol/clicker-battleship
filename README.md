# Clicker Battleship Game

A hybrid game combining clicker mechanics with strategic naval combat. Players accumulate resources through clicking, defend their territory, and launch strategic attacks against opponents.

## Features

### Phase 1: Core Clicker Mechanics
- Click to earn coins
- Purchase upgrades to increase coin generation
- Auto-clickers for passive income
- Resource management system

### Phase 2: Battleship Grid System
- Grid-based naval combat
- Ship placement and rotation
- Turn-based targeting system
- Hit detection and damage calculation

### Phase 3: Reset Bomb and Defense Systems
- Reset bombs that affect multiple grid cells
- Shield system to protect ships
- Upgrade paths for bombs and shields
- Strategic resource allocation

### Phase 4: Multiplayer Features
- Local game state persistence
- Leaderboard system
- Game statistics tracking
- Score calculation based on performance

## Technology Stack

- **Frontend**: React with TypeScript
- **Game Engine**: Phaser.js integration
- **State Management**: Redux Toolkit
- **Persistence**: LocalStorage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/clicker-battleship.git
cd clicker-battleship
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3001`

## How to Play

1. **Earn Resources**: Click the button to earn coins
2. **Purchase Upgrades**: Use coins to buy upgrades like click multipliers and auto-clickers
3. **Place Ships**: During the setup phase, place your ships on the grid
4. **Battle**: Take turns firing at your opponent's grid
5. **Use Special Items**: Deploy shields to protect your ships and launch reset bombs for area attacks
6. **Win the Game**: Sink all of your opponent's ships to win

## Game Phases

1. **Setup Phase**: Place your ships on the grid
2. **Battle Phase**: Take turns attacking your opponent
3. **End Phase**: Game concludes when all ships of one player are sunk

## Development Roadmap

- [ ] Enhanced AI for computer opponent
- [ ] Online multiplayer via WebSockets
- [ ] Mobile-responsive design
- [ ] Additional ship types and special abilities
- [ ] Achievement system
- [ ] Daily challenges

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic Battleship games and idle clickers
- Built with React and Redux Toolkit 