import React, { useEffect, useState, useRef } from 'react';
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
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add click event listener to detect clicks outside
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    // Add the event listener when expanded
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleColorSelect = (color: string) => {
    console.log('ColorPicker - Setting color to:', color);
    dispatch(setCounterColor(color));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle click on the color dot
  const handleColorDotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpanded();
  };

  return (
    <div ref={colorPickerRef} className={styles.colorPickerContainer}>
      {/* Button/Icon */}
      <div 
        className={styles.colorButton}
        onClick={handleColorDotClick}
        title="Change counter color"
      >
        <div 
          className={styles.currentColorDot} 
          style={{ backgroundColor: currentColor, borderColor: currentColor }}
        />
      </div>
      
      {/* Expanded Color Picker Panel */}
      {isExpanded && (
        <div className={styles.colorPickerPanel}>
          <div className={styles.header}>
            <h3 className={styles.title}>Counter Color</h3>
            <button 
              className={styles.toggleButton} 
              onClick={toggleExpanded}
              aria-label="Close color picker"
            >
              ×
            </button>
          </div>
          
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
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 