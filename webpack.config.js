const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  return {
    mode: options.mode,
    entry: {
      index: [path.resolve(__dirname, 'src/index.ts'), path.resolve(__dirname, 'public/css/index.css')],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].bundle.css',
      }),
    ],
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
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 1 } }],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    devtool: options.mode === 'development' ? 'eval-source-map' : 'none',
  };
};
