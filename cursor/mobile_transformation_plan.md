# Mobile Platform Transformation Plan - Clicker Bomber

## Current State Analysis
- React web application with TypeScript
- Current tech stack:
  - React 18.2.0
  - Redux + Redux Toolkit for state management
  - TypeScript
  - Webpack for bundling
  - Jest for testing
- Already has some mobile-specific functionality:
  - `MobileContext` for detecting mobile devices
  - Mobile browser hacks for capturing volume button events
  - Mobile-specific components like `VolumeButtonCapture`
  - Detection for iOS and Android

## App Requirements
- Multi-platform mobile application
- Release for Android and iOS users
- Maintain current game functionality
- Leverage existing code where possible

## Possible Approaches

### 1. **React Native (Recommended)**
- **Overview**: Convert the web app to a React Native app
- **Pros**:
  - Native performance and look & feel
  - Access to native device features
  - Large ecosystem of libraries
  - Shared JavaScript/TypeScript logic between platforms
  - Supports both Android and iOS from a single codebase
- **Cons**:
  - Requires significant rewrite of UI components
  - Learning curve for React Native specific APIs

### 2. **PWA (Progressive Web App)**
- **Overview**: Enhance current web app with PWA features
- **Pros**:
  - Least amount of code changes required
  - Can be installed on home screen
  - Works across all platforms
  - Reuses existing web code
- **Cons**:
  - Limited access to native features
  - Not distributed through app stores (less discovery)
  - Performance may not match native apps

### 3. **Hybrid Approach with Capacitor**
- **Overview**: Wrap the existing React app in Capacitor
- **Pros**:
  - Reuse most of existing web code
  - Access to native APIs via plugins
  - Available on app stores
  - Easier to implement than full React Native conversion
- **Cons**:
  - Not as performant as React Native
  - UI may not feel fully native

## Recommended Approach: React Native + Expo

After analyzing the application, we recommend using **React Native with Expo** for the following reasons:

1. **Expo provides an easier development experience** - simplified workflow for building, testing, and publishing
2. **The existing app already has mobile considerations** - suggesting mobile is a core use case
3. **Game performance will benefit from native rendering**
4. **Access to native APIs** will enhance the mobile experience

## Implementation Plan

### Phase 1: Setup and Project Structure ✅
1. ✅ Create a new React Native project with Expo
   ```
   npx create-expo-app -t expo-template-blank-typescript mobile
   ```
2. ✅ Install core dependencies
   ```
   npm install @reduxjs/toolkit react-redux uuid
   ```
3. ✅ Set up project structure mirroring current app organization
4. ✅ Configure Redux store and state management

### Phase 2: Core Logic Migration ✅
1. ✅ Migrate game core logic (Redux store, game state management)
2. ✅ Adapt utility functions to work in React Native environment
3. ✅ Port context providers (User, Mobile)

### Phase 3: UI Components ⏳
1. ⏳ Recreate UI components using React Native
   - ✅ Basic GameScreen and WatchScreen components
   - ⏳ Game components
   - ⏳ Watch components
   - ⏳ UI elements (buttons, pickers)
2. ⏳ Implement mobile-specific features
   - ⏳ Volume button capture
   - ✅ Haptic feedback
   - ✅ Screen orientation handling

### Phase 4: Testing & Optimization
1. Test on Android and iOS simulators
2. Optimize performance
3. Address platform-specific issues

### Phase 5: Deployment
1. Configure app for stores
2. Generate assets (icons, splash screens)
3. Build release versions
4. Publish to App Store and Google Play

## Estimated Timeline
- Phase 1: 1 week
- Phase 2: 1-2 weeks
- Phase 3: 2-3 weeks
- Phase 4: 1 week
- Phase 5: 1 week

Total: 6-8 weeks for complete migration

## Progress Log

### April 29, 2023
- Created Expo TypeScript project in 'mobile' directory
- Installed core dependencies (@reduxjs/toolkit, react-redux, uuid, @react-native-async-storage/async-storage)
- Set up directory structure mirroring web app
- Implemented core files:
  - Redux store configuration
  - Game slice for state management
  - Storage utility with AsyncStorage
  - MobileContext and UserContext providers
  - Theme for consistent styling
  - Basic screen components (GameScreen, WatchScreen)
  - Main App component structure 