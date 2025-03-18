import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Shop from './Shop';
import './ShopButton.css';

const ShopButton: React.FC = () => {
  const [showShop, setShowShop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { resources } = useSelector((state: RootState) => state.game);
  
  return (
    <>
      <div className="shop-button-container">
        <button 
          className="shop-button" 
          onClick={() => setShowShop(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          title="Shop"
          aria-label="Open Shop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
        
        {showTooltip && (
          <div className="shop-tooltip">
            <div className="tooltip-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="14" r="6" fill="#333"></circle>
                <path d="M12 8V5" stroke="#ff5252"></path>
                <path d="M15 10L17 8" stroke="#ff5252"></path>
                <path d="M9 10L7 8" stroke="#ff5252"></path>
              </svg>
              <span>{resources.bombs}</span>
            </div>
            <div className="tooltip-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20s-6-3-6-8.5V6l6-2 6 2v5.5c0 5.5-6 8.5-6 8.5z" fill="#3498db" stroke="#2980b9"></path>
              </svg>
              <span>{resources.shields}</span>
            </div>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
      
      {showShop && (
        <div className="modal-overlay">
          <Shop onClose={() => setShowShop(false)} />
        </div>
      )}
    </>
  );
};

export default ShopButton; 