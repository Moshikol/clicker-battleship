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
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Handle click on the entire collapsed picker
  const handlePickerClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      toggleExpanded();
    }
  };

  // SVG icon for the color palette when collapsed
  const ColorPaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.paletteIcon} style={{ color: currentColor }}>
      <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
      <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"/>
    </svg>
  );

  return (
    <div 
      className={`${styles.colorPicker} ${!isExpanded ? styles.collapsed : ''}`}
      onClick={!isExpanded ? handlePickerClick : undefined}
    >
      <div className={styles.header}>
        {isExpanded ? (
          <>
            <h3 className={styles.title}>Counter Color</h3>
            <button 
              className={styles.toggleButton} 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
              aria-label="Collapse color picker"
            >
              −
            </button>
          </>
        ) : (
          <div className={styles.collapsedIcon}>
            <ColorPaletteIcon />
            <div 
              className={styles.currentColorDot} 
              style={{ backgroundColor: currentColor, borderColor: currentColor }}
              title="Current color"
            />
          </div>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div className={styles.colorGrid}>
            {COLORS.map((color, index) => (
              <div
                key={index}
                className={`${styles.colorOption} ${color === currentColor ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorSelect(color);
                }}
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