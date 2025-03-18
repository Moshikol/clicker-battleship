import React, { useState, useEffect } from 'react';
import { useMobile } from '../../context/MobileContext';

// Component styling
const styles = {
  debugContainer: {
    position: 'fixed' as const,
    bottom: '10px',
    left: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#00ff00',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 9999,
    maxHeight: '150px',
    overflowY: 'auto' as const,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  },
  debugTitle: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#ffffff',
    fontWeight: 'bold' as const,
  },
  debugItem: {
    margin: '3px 0',
    borderBottom: '1px solid #333',
    paddingBottom: '3px',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '5px',
    right: '5px',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  toggleButton: {
    position: 'fixed' as const,
    bottom: '10px',
    right: '10px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  }
};

interface DebugEvent {
  id: number;
  type: string;
  keyCode?: number;
  key?: string;
  code?: string;
  timestamp: number;
}

const MobileDebugHelper: React.FC = () => {
  const { isMobile } = useMobile();
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [nextId, setNextId] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  
  // Only show debug on mobile devices
  if (!isMobile) return null;
  
  useEffect(() => {
    const handleKeyEvent = (e: KeyboardEvent) => {
      console.log('Debug detected key event:', e.type, e.key, e.keyCode, e.code);
      
      // Add the event to our log
      setEvents(prevEvents => {
        // Keep only the last 10 events
        const newEvents = [
          {
            id: nextId,
            type: e.type,
            keyCode: e.keyCode,
            key: e.key,
            code: e.code,
            timestamp: Date.now()
          },
          ...prevEvents
        ].slice(0, 10);
        
        setNextId(nextId + 1);
        return newEvents;
      });
    };
    
    // Add listeners
    if (showDebug) {
      window.addEventListener('keydown', handleKeyEvent, { capture: true });
      window.addEventListener('keyup', handleKeyEvent, { capture: true });
      document.addEventListener('keydown', handleKeyEvent, { capture: true });
      document.addEventListener('keyup', handleKeyEvent, { capture: true });
    }
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyEvent, { capture: true });
      window.removeEventListener('keyup', handleKeyEvent, { capture: true });
      document.removeEventListener('keydown', handleKeyEvent, { capture: true });
      document.removeEventListener('keyup', handleKeyEvent, { capture: true });
    };
  }, [showDebug, nextId]);
  
  const clearEvents = () => {
    setEvents([]);
  };
  
  if (!showDebug) {
    return (
      <button 
        style={styles.toggleButton}
        onClick={() => setShowDebug(true)}
      >
        🐛
      </button>
    );
  }
  
  return (
    <div style={styles.debugContainer}>
      <div style={styles.debugTitle}>
        Mobile Key Events Debug
        <button 
          style={styles.closeButton}
          onClick={() => setShowDebug(false)}
        >
          ✕
        </button>
      </div>
      
      <div>
        <button onClick={clearEvents}>Clear Events</button>
      </div>
      
      {events.length === 0 ? (
        <div style={styles.debugItem}>No events captured yet. Press volume buttons.</div>
      ) : (
        events.map(event => (
          <div key={event.id} style={styles.debugItem}>
            [{new Date(event.timestamp).toISOString().substr(11, 8)}] 
            Type: {event.type}, 
            Key: {event.key || 'none'}, 
            KeyCode: {event.keyCode || 'none'}, 
            Code: {event.code || 'none'}
          </div>
        ))
      )}
    </div>
  );
};

export default MobileDebugHelper; 