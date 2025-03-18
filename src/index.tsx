import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import the build version for cache busting
import { BUILD_VERSION } from './buildVersion';

// Log the build version to console to verify it's working
console.log(`App initialized with build version: ${BUILD_VERSION}`);

// Append build version to document for debugging
if (process.env.NODE_ENV !== 'production') {
  const versionElement = document.createElement('div');
  versionElement.style.position = 'fixed';
  versionElement.style.bottom = '2px';
  versionElement.style.right = '2px';
  versionElement.style.fontSize = '10px';
  versionElement.style.opacity = '0.5';
  versionElement.style.zIndex = '9999';
  versionElement.textContent = `Ver: ${BUILD_VERSION}`;
  document.body.appendChild(versionElement);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 