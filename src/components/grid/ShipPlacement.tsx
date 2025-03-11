import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { placeShip, rotateShip, setPlayerReady } from '../../store/gameSlice';
import { Ship } from '../../store/types';
import styles from './ShipPlacement.module.css';

export const ShipPlacement: React.FC = () => {
  const dispatch = useDispatch();
  const { grid } = useSelector((state: RootState) => state.game);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  
  const handleShipSelect = (shipId: string) => {
    setSelectedShipId(shipId);
  };
  
  const handleCellClick = (x: number, y: number) => {
    if (selectedShipId) {
      const ship = grid.player.ships.find(s => s.id === selectedShipId);
      if (ship) {
        dispatch(placeShip({
          shipId: selectedShipId,
          x,
          y,
          isHorizontal: ship.position.isHorizontal,
        }));
      }
    }
  };
  
  const handleRotateShip = () => {
    if (selectedShipId) {
      dispatch(rotateShip({ shipId: selectedShipId }));
    }
  };
  
  const handleReadyClick = () => {
    dispatch(setPlayerReady());
  };
  
  const renderShipSelector = (ship: Ship, index: number) => {
    const isPlaced = ship.position.x >= 0 && ship.position.y >= 0;
    const isSelected = ship.id === selectedShipId;
    
    return (
      <div 
        key={ship.id}
        className={`${styles.shipSelector} ${isPlaced ? styles.placed : ''} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleShipSelect(ship.id)}
      >
        <div className={styles.shipInfo}>
          <span>Ship {index + 1}</span>
          <span>Size: {ship.size}</span>
        </div>
        <div className={styles.shipPreview}>
          {Array.from({ length: ship.size }).map((_, i) => (
            <div key={i} className={styles.shipCell} />
          ))}
        </div>
      </div>
    );
  };
  
  const renderCell = (cell: any, rowIndex: number, colIndex: number) => {
    let cellClass = styles.cell;
    
    if (cell.hasShip) {
      cellClass += ` ${styles.ship}`;
    }
    
    return (
      <div 
        key={`${rowIndex}-${colIndex}`}
        className={cellClass}
        onClick={() => handleCellClick(colIndex, rowIndex)}
      >
        {colIndex === 0 && <div className={styles.rowLabel}>{rowIndex + 1}</div>}
        {rowIndex === 0 && <div className={styles.colLabel}>{String.fromCharCode(65 + colIndex)}</div>}
      </div>
    );
  };
  
  const allShipsPlaced = grid.player.ships.every(ship => ship.position.x >= 0 && ship.position.y >= 0);
  
  return (
    <div className={styles.container}>
      <h2>Place Your Ships</h2>
      
      <div className={styles.placementArea}>
        <div className={styles.gridContainer}>
          <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${grid.size}, 1fr)` }}>
            {grid.player.grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
            )}
          </div>
          
          <div className={styles.controls}>
            <button 
              className={styles.rotateButton} 
              onClick={handleRotateShip}
              disabled={!selectedShipId}
            >
              Rotate Ship
            </button>
            
            <button 
              className={styles.readyButton} 
              onClick={handleReadyClick}
              disabled={!allShipsPlaced}
            >
              Ready to Battle!
            </button>
          </div>
        </div>
        
        <div className={styles.shipSelectors}>
          <h3>Your Ships</h3>
          {grid.player.ships.map((ship, index) => renderShipSelector(ship, index))}
        </div>
      </div>
      
      <div className={styles.instructions}>
        <p>1. Select a ship from the list</p>
        <p>2. Click on the grid to place it</p>
        <p>3. Use the Rotate button to change orientation</p>
        <p>4. Place all ships to continue</p>
      </div>
    </div>
  );
}; 