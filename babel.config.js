const gtPlugin = require("gt-react-native/plugin");
const gtConfig = require("./gt.config.json");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        gtPlugin,
        {
          locales: [gtConfig.defaultLocale, ...gtConfig.locales],
          entryPointFilePath: require.resolve("expo-router/entry"),
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
