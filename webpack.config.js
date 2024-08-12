const path = require('path');

module.exports = {
  mode: 'development',  // Lub 'production', zależnie od potrzeb
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,  // Reguła do przetwarzania plików CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/rrule/,
          /node_modules\/@devexpress\/dx-scheduler-core\/node_modules\/rrule/,
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'rrule': path.resolve(__dirname, 'node_modules/rrule/dist/esm/index.js')
    }
  },
  ignoreWarnings: [/Failed to parse source map/],
};

