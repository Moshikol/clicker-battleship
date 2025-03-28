module.exports = {
  name: "Clicker Battleship",
  slug: "clicker-battleship",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#1A1A1A"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1A1A1A"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    // Development settings for hot reload
    isDevMode: process.env.NODE_ENV === 'development',
    enableHotReload: true,
    disableRedboxing: false,
    // Metro bundler configuration
    metro: {
      resetCache: true,
      maxWorkers: 4
    }
  }
}; 