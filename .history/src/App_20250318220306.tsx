import React, { useEffect, useState, useCallback, Suspense } from 'react';
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

// Error boundary component to catch rendering errors
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state: { hasError: boolean; error: Error | null; errorInfo: any } = { 
    hasError: false, 
    error: null, 
    errorInfo: null 
  };
  
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    
    // Log to console and to our error display
    console.error('App error:', error, errorInfo);
    
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.style.display = 'block';
      errorDisplay.innerHTML += `<p>APP ERROR: ${error?.message || 'Unknown error'}</p>`;
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 20, 
          color: 'white',
          backgroundColor: '#333',
          textAlign: 'center',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>Something went wrong</h2>
          <p>The app has encountered an error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              margin: '20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh App
          </button>
          <pre style={{ 
            textAlign: 'left', 
            maxWidth: '100%', 
            overflow: 'auto',
            backgroundColor: '#222',
            padding: 10,
            borderRadius: 4,
            fontSize: '12px'
          }}>
            {this.state.error ? this.state.error.toString() : 'Unknown error'}
          </pre>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Loading component for suspense fallback
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: 'white'
  }}>
    <div>
      <h2>Loading...</h2>
      <p>Please wait while the game initializes.</p>
    </div>
  </div>
);

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
  const [appReady, setAppReady] = useState(false);
  
  const navigateTo = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);
  
  // Ensure DOM is ready before mounting mobile components
  const [domReady, setDomReady] = useState(false);
  
  useEffect(() => {
    // Add a visible indicator that the app is starting
    console.log('App starting...');
    
    // Ensure the DOM is fully loaded before initializing mobile components
    if (document.readyState === 'complete') {
      setDomReady(true);
    } else {
      const handleDomReady = () => {
        console.log('DOM fully loaded');
        setDomReady(true);
      };
      window.addEventListener('load', handleDomReady);
      return () => window.removeEventListener('load', handleDomReady);
    }
  }, []);
  
  // Set app as ready after a short delay to ensure all components have initialized
  useEffect(() => {
    if (domReady) {
      const timer = setTimeout(() => {
        console.log('App fully initialized');
        setAppReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [domReady]);
  
  // Return loading screen until app is ready
  if (!appReady) {
    return <Loading />;
  }
  
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
    <AppErrorBoundary>
      <Provider store={store}>
        <MobileProvider>
          <Suspense fallback={<Loading />}>
            <AppContent />
          </Suspense>
        </MobileProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default App; 