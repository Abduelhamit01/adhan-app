const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any custom configuration here
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.watchFolders = [__dirname];

module.exports = config; 