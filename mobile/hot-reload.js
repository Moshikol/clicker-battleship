#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.EXPO_DEBUG = 'true';

// Clear Metro cache
console.log('🔥 Clearing Metro bundler cache...');
const tempDir = path.resolve(__dirname, '.expo', 'metro-cache');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Run Expo with hot reload options
console.log('🚀 Starting development server with hot reload enabled...');
const expo = spawn('npx', ['expo', 'start', '--hot', '--clear'], {
  stdio: 'inherit',
  shell: true,
});

// Handle process exit
process.on('SIGINT', () => {
  expo.kill('SIGINT');
  console.log('\n🛑 Development server stopped');
  process.exit(0);
});

expo.on('exit', (code) => {
  console.log(`⚙️ Metro bundler exited with code ${code}`);
  process.exit(code);
}); 