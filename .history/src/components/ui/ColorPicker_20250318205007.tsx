import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCounterColor } from '../../store/gameSlice';
import styles from './ColorPicker.module.css';

// Define more visible colors
const COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
  '#FF1493', // Deep Pink
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#FFFFFF', // White
  '#00FF7F', // Spring Green
];

const ColorPicker: React.FC = () => {
  const dispatch = useDispatch();
  const currentColor = useSelector((state: RootState) => state.game.counterColor);
  const [isExpanded, setIsExpanded] = useState(true);

  // Log the current color for debugging
  useEffect(() => {
    console.log('ColorPicker - Current color in Redux store:', currentColor);
  }, [currentColor]);

  const handleColorSelect = (color: string) => {
    console.log('ColorPicker - Setting color to:', color);
    dispatch(setCounterColor(color));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.colorPicker} ${!isExpanded ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Counter Color</h3>
        <button 
          className={styles.toggleButton} 
          onClick={toggleExpanded}
          aria-label={isExpanded ? "Collapse color picker" : "Expand color picker"}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className={styles.colorGrid}>
            {COLORS.map((color, index) => (
              <div
                key={index}
                className={`${styles.colorOption} ${color === currentColor ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
          <div className={styles.currentColor}>
            <span>Current: </span>
            <span style={{ color: currentColor, fontWeight: 'bold' }}>Sample Text</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker; 