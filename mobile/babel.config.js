module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable react refresh plugin for improved hot reload
      process.env.NODE_ENV !== 'production' && 'react-refresh/babel',
    ].filter(Boolean),
  };
}; 