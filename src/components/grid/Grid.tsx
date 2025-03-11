import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fireAtOpponent, deployShield, launchResetBomb } from '../../store/gameSlice';
import styles from './Grid.module.css';

interface GridProps {
  isOpponent?: boolean;
}

export const Grid: React.FC<GridProps> = ({ isOpponent = false }) => {
  const dispatch = useDispatch();
  const { grid, resources } = useSelector((state: RootState) => state.game);
  const gridData = isOpponent ? grid.opponent?.grid : grid.player.grid;
  
  if (!gridData) {
    return <div className={styles.container}>Loading grid...</div>;
  }
  
  const handleCellClick = (x: number, y: number) => {
    if (isOpponent) {
      // Attack opponent's grid
      if (grid.gamePhase === 'battle' && grid.isPlayerTurn) {
        dispatch(fireAtOpponent({ x, y }));
      }
    } else {
      // Deploy shield on player's grid
      if (grid.gamePhase === 'battle' && grid.isPlayerTurn && resources.shields > 0) {
        dispatch(deployShield({ x, y }));
      }
    }
  };
  
  const handleBombClick = (x: number, y: number) => {
    if (isOpponent && grid.gamePhase === 'battle' && grid.isPlayerTurn && resources.bombs > 0) {
      dispatch(launchResetBomb({ x, y }));
    }
  };
  
  const renderCell = (cell: any, rowIndex: number, colIndex: number) => {
    let cellClass = styles.cell;
    
    if (isOpponent) {
      // Opponent's grid
      if (cell.isHit) {
        cellClass += cell.hasShip ? ` ${styles.hit}` : ` ${styles.miss}`;
      }
    } else {
      // Player's grid
      if (cell.hasShip) {
        cellClass += ` ${styles.ship}`;
      }
      if (cell.isHit) {
        cellClass += ` ${styles.hit}`;
      }
      if (cell.isShielded) {
        cellClass += ` ${styles.shielded}`;
      }
    }
    
    return (
      <div 
        key={`${rowIndex}-${colIndex}`}
        className={cellClass}
        onClick={() => handleCellClick(colIndex, rowIndex)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleBombClick(colIndex, rowIndex);
        }}
      >
        {colIndex === 0 && <div className={styles.rowLabel}>{rowIndex + 1}</div>}
        {rowIndex === 0 && <div className={styles.colLabel}>{String.fromCharCode(65 + colIndex)}</div>}
      </div>
    );
  };
  
  return (
    <div className={styles.container}>
      <h3>{isOpponent ? "Opponent's Grid" : "Your Grid"}</h3>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${grid.size}, 1fr)` }}>
        {gridData.map((row, rowIndex) => 
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>
      {isOpponent && (
        <div className={styles.instructions}>
          <p>Click to fire at a cell</p>
          <p>Right-click to launch a reset bomb ({resources.bombs} available)</p>
        </div>
      )}
      {!isOpponent && (
        <div className={styles.instructions}>
          <p>Click to deploy a shield ({resources.shields} available)</p>
        </div>
      )}
    </div>
  );
}; 