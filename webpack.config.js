const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, options) => {
  const ret = {
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({ include: /\.min\.js$/ })],
    },
    mode: options.mode,
    entry: {
      lib: [path.resolve(__dirname, 'src/index.ts')],
      'lib.min': [path.resolve(__dirname, 'src/index.ts')],
    },
    output: {
      path: path.resolve(__dirname, '_bundles'),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'Jsture',
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
          exclude: '/node_modules/',
        },
      ],
    },
  };

  if (options.mode === 'development') {
    ret.devtool = 'eval-source-map';
  }

  return ret;
};
