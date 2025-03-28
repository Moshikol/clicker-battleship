// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable hot module replacement
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.transformer.unstable_allowRequireContext = true;

// Optimize hot reload performance
config.cacheStores = [];
config.resetCache = true;
config.maxWorkers = 4;

// Fast refresh options
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
config.transformer.minifierPath = 'metro-minify-terser';

module.exports = config; 