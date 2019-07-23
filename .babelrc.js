module.exports = {
  presets: ['jest'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
      },
    ],
  ],
};
