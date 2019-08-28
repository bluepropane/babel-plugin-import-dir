const presets = ['@babel/preset-env'];
const plugins = [
  '@babel/plugin-proposal-class-properties',
  [
    'babel-plugin-module-resolver',
    {
      root: ['./src'],
      alias: {
        src: './src',
      },
    },
  ],
];

module.exports = {
  env: {
    test: {
      presets,
      plugins: [...plugins, '@babel/plugin-transform-runtime'],
    },
    development: {
      presets,
      plugins,
    },
  },
};
