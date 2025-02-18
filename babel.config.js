module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // other plugins
      // ["react-native-unistyles/plugin",{
      //   autoProcessImports: ['react-native-magnus']
      // }],
      ["react-native-reanimated/plugin"],
    ],
  };
};
