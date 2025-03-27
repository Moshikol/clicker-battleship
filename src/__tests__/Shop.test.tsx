import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Shop from '../components/shop/Shop';
import gameReducer from '../store/gameSlice';

describe('Shop Component', () => {
  let store: ReturnType<typeof configureStore>;
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        game: gameReducer
      }
    });
    
    // Reset mock function
    mockOnClose.mockReset();
  });
  
  const renderWithProviders = () => {
    return render(
      <Provider store={store}>
        <Shop onClose={mockOnClose} />
      </Provider>
    );
  };
  
  test('should render shop component with initial state', () => {
    renderWithProviders();
    
    // Check for shop title
    expect(screen.getByText('Shop')).toBeInTheDocument();
    
    // Check for shop items
    expect(screen.getByText('Bomb')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    
    // Check for resource display
    expect(screen.getByText('Coins:')).toBeInTheDocument();
    expect(screen.getByText('Bombs:')).toBeInTheDocument();
    expect(screen.getByText('Shields:')).toBeInTheDocument();
    
    // Check for purchase buttons
    const buyButtons = screen.getAllByText('Buy');
    expect(buyButtons.length).toBe(2);
  });
  
  test('should call onClose when close button is clicked', () => {
    renderWithProviders();
    
    // Find and click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('should disable buy buttons when not enough coins', () => {
    renderWithProviders();
    
    // Get the resources section
    const resourceSection = screen.getByText('Coins:').parentElement;
    
    // Find the coin value within the resources section
    const coinValueElement = resourceSection?.querySelector('.resource-value');
    expect(coinValueElement?.textContent).toBe('0');
    
    // Buy buttons should be disabled
    const buyButtons = screen.getAllByText('Buy');
    buyButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
  
  test('should enable buy buttons when sufficient coins', () => {
    // Setup store with coins
    store.dispatch({
      type: 'game/addCoins',
      payload: 100
    });
    
    renderWithProviders();
    
    // Both buy buttons should be enabled now (Bomb costs 100, Shield costs 50)
    const buyButtons = screen.getAllByText('Buy');
    buyButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });
  
  test('should update resources when items are purchased', () => {
    // Setup store with coins
    store.dispatch({
      type: 'game/addCoins',
      payload: 100
    });
    
    renderWithProviders();
    
    // Get resource elements
    const resourcesContainer = screen.getByText('Coins:').closest('.current-resources');
    
    // Get elements containing initial values
    const resourceValues = resourcesContainer?.querySelectorAll('.resource-value');
    if (!resourceValues) throw new Error('Cannot find resource values');
    
    // Check initial values (resource order: coins, bombs, shields)
    expect(resourceValues[0].textContent).toBe('100'); // Coins
    expect(resourceValues[1].textContent).toBe('0');   // Bombs
    expect(resourceValues[2].textContent).toBe('10');  // Shields
    
    // Purchase a shield (costs 50)
    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[1]); // Shield buy button
    
    // Verify updated values
    expect(resourceValues[0].textContent).toBe('50');  // Coins after purchase
    expect(resourceValues[2].textContent).toBe('11');  // Shields after purchase
  });
  
  test('happy path - purchase multiple items in sequence', () => {
    // Setup store with coins
    store.dispatch({
      type: 'game/addCoins',
      payload: 200
    });
    
    renderWithProviders();
    
    // Get resource elements
    const resourcesContainer = screen.getByText('Coins:').closest('.current-resources');
    
    // Get elements containing values
    const resourceValues = resourcesContainer?.querySelectorAll('.resource-value');
    if (!resourceValues) throw new Error('Cannot find resource values');
    
    // Check initial values (resource order: coins, bombs, shields)
    expect(resourceValues[0].textContent).toBe('200'); // Initial coins
    
    // Purchase a shield (costs 50)
    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[1]); // Shield buy button
    
    // Verify updated values
    expect(resourceValues[0].textContent).toBe('150'); // Coins after shield purchase
    expect(resourceValues[2].textContent).toBe('11');  // Shields after purchase
    
    // Purchase a bomb (costs 100)
    fireEvent.click(buyButtons[0]); // Bomb buy button
    
    // Verify updated values
    expect(resourceValues[0].textContent).toBe('50');  // Coins after bomb purchase
    expect(resourceValues[1].textContent).toBe('1');   // Bombs after purchase
    
    // Purchase another shield
    fireEvent.click(buyButtons[1]); // Shield buy button
    
    // Verify final values
    expect(resourceValues[0].textContent).toBe('0');   // No coins left
    expect(resourceValues[2].textContent).toBe('12');  // Shields after second purchase
    
    // Buy buttons should be disabled again
    buyButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
}); 