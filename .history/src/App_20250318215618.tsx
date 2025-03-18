import React, { useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Watch } from './components/watch/Watch';
import { Game } from './components/game/Game';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { autoClickTick } from './store/gameSlice';
import ColorPicker from './components/ui/ColorPicker';
import { MobileProvider } from './context/MobileContext';
import VolumeButtonCapture from './components/mobile/VolumeButtonCapture';
import MobileDebugHelper from './components/mobile/MobileDebugHelper';
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
  
  const navigateTo = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);
  
  // Ensure DOM is ready before mounting mobile components
  const [domReady, setDomReady] = useState(false);
  
  useEffect(() => {
    // Ensure the DOM is fully loaded before initializing mobile components
    if (document.readyState === 'complete') {
      setDomReady(true);
    } else {
      const handleDomReady = () => setDomReady(true);
      window.addEventListener('load', handleDomReady);
      return () => window.removeEventListener('load', handleDomReady);
    }
  }, []);
  
  return (
    <NavigationContext.Provider value={{ navigateTo, currentPage }}>
      <AutoClickHandler />
      {domReady && (
        <>
          <VolumeButtonCapture />
          <MobileDebugHelper />
        </>
      )}
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
      <MobileProvider>
        <AppContent />
      </MobileProvider>
    </Provider>
  );
};

export default App; 