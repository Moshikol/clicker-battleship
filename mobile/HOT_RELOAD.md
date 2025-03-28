# Hot Reload Configuration for Clicker Battleship

This project has been configured with enhanced hot reloading capabilities to improve the development experience.

## Quick Start

To start the development server with hot reload enabled:

```bash
npm run hot-reload
```

This script:
- Clears the Metro bundler cache
- Sets appropriate environment variables
- Starts Expo with hot reload enabled

## Other Development Commands

The following npm scripts have been configured for development:

- `npm run dev` - Start Expo with hot reload
- `npm run android` - Start Android development with hot reload
- `npm run ios` - Start iOS development with hot reload
- `npm run web` - Start web development with hot reload

## Configuration Files

Hot reloading is configured through several files:

1. `metro.config.js` - Metro bundler configuration for React Native
2. `babel.config.js` - Babel configuration with the React Refresh plugin
3. `app.config.js` - Expo configuration with development settings
4. `hot-reload.js` - Custom script for enhanced hot reload experience

## Troubleshooting

If you experience issues with hot reloading:

1. **Clear cache manually**:
   ```bash
   npx expo start --clear
   ```

2. **Restart the packager**:
   Press `r` in the Metro bundler console.

3. **Force a full reload**:
   Shake your device or press `Cmd+R` (iOS) or `R, R` (Android) in the simulator.

4. **Check for errors in your terminal** as some syntax errors may break hot reloading.

## Performance Optimization

For large projects, you might want to optimize the hot reload configuration:

- Adjust `maxWorkers` in metro.config.js based on your machine's capabilities
- Consider using `--no-minify` flag during development for faster builds 