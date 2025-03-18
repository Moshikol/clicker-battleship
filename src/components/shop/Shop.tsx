import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { purchaseBomb, purchaseShield } from '../../store/gameSlice';
import './Shop.css';

interface ShopProps {
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { resources } = useSelector((state: RootState) => state.game);

  const handlePurchaseBomb = () => {
    dispatch(purchaseBomb());
  };

  const handlePurchaseShield = () => {
    dispatch(purchaseShield());
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h2>Shop</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="current-resources">
        <div className="resource">
          <div className="resource-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#F1C40F" />
              <text x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#111">$</text>
            </svg>
          </div>
          <span className="resource-label">Coins:</span>
          <span className="resource-value">{resources.coins}</span>
        </div>
        <div className="resource">
          <div className="resource-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="14" r="6" fill="#333" />
              <path d="M12 8V5" stroke="#ff5252" />
              <path d="M15 10L17 8" stroke="#ff5252" />
              <path d="M9 10L7 8" stroke="#ff5252" />
            </svg>
          </div>
          <span className="resource-label">Bombs:</span>
          <span className="resource-value">{resources.bombs}</span>
        </div>
        <div className="resource">
          <div className="resource-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20s-6-3-6-8.5V6l6-2 6 2v5.5c0 5.5-6 8.5-6 8.5z" fill="#3498db" stroke="#2980b9" />
              <path d="M12 12l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="#ffffff" stroke="none" />
            </svg>
          </div>
          <span className="resource-label">Shields:</span>
          <span className="resource-value">{resources.shields}</span>
        </div>
      </div>
      
      <div className="shop-items">
        <div className="shop-item">
          <div className="item-icon bomb-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="14" r="8" fill="#333"></circle>
              <path d="M12 6V2" stroke="#ff5252"></path>
              <path d="M17 9L19.5 6.5" stroke="#ff5252"></path>
              <path d="M7 9L4.5 6.5" stroke="#ff5252"></path>
              <path d="M16 14a4 4 0 01-8 0" fill="#ff5252" stroke="none"></path>
              <circle cx="14" cy="10" r="1" fill="#ffffff" stroke="none"></circle>
            </svg>
          </div>
          <div className="item-info">
            <h3>Bomb</h3>
            <p>Powerful weapon that hits multiple cells</p>
          </div>
          <div className="item-action">
            <span className="item-price">100 coins</span>
            <button 
              className="purchase-button"
              onClick={handlePurchaseBomb}
              disabled={resources.coins < 100}
            >
              Buy
            </button>
          </div>
        </div>
        
        <div className="shop-item">
          <div className="item-icon shield-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8V4.2L12 2l8 2.2v6c0 7.3-8 11.8-8 11.8z" fill="#3498db" stroke="#2980b9"></path>
              <path d="M12 22s8-4.5 8-11.8V8" stroke="#2980b9"></path>
              <path d="M12 13l-3-3 1.5-1.5L12 10l5-5 1.5 1.5L12 13z" fill="#ffffff" stroke="#ffffff"></path>
            </svg>
          </div>
          <div className="item-info">
            <h3>Shield</h3>
            <p>Protects your ships from one hit</p>
          </div>
          <div className="item-action">
            <span className="item-price">50 coins</span>
            <button 
              className="purchase-button"
              onClick={handlePurchaseShield}
              disabled={resources.coins < 50}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 