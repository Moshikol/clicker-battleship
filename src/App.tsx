import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Watch } from './components/watch/Watch';
import { Game } from './components/game/Game';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { autoClickTick } from './store/gameSlice';
import ColorPicker from './components/ui/ColorPicker';
import './styles/global.css';

// Component that handles auto-clicking
const AutoClickHandler: React.FC = () => {
  const dispatch = useDispatch();
  const { upgrades } = useSelector((state: RootState) => state.game);
  
  // Set up auto-clicker interval
  useEffect(() => {
    const autoClickInterval = setInterval(() => {
      if (upgrades.autoClickersCount > 0) {
        dispatch(autoClickTick());
      }
    }, 1000);
    
    return () => clearInterval(autoClickInterval);
  }, [dispatch, upgrades.autoClickersCount]);
  
  return null;
};

// Navigation context
export const NavigationContext = React.createContext({
  navigateTo: (page: string) => {},
  currentPage: 'watch'
});

// Main app with navigation
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('watch');
  
  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };
  
  return (
    <NavigationContext.Provider value={{ navigateTo, currentPage }}>
      <AutoClickHandler />
      <ColorPicker />
      {currentPage === 'watch' && <Watch />}
      {currentPage === 'game' && <Game />}
    </NavigationContext.Provider>
  );
};

// Root component with Redux Provider
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App; 