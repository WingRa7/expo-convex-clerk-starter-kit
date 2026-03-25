module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'gt-react-native/plugin',
        {
          locales: ['es', 'fr', 'ja'],
          entryPointFilePath: require.resolve('expo-router/entry'),
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
