const path = require(`path`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);

module.exports = {
  entry: `./src/index.js`,
  output: {
    path: path.join(__dirname, `public`),
    filename: `bundle.js`,
    publicPath: '/',
  },

  devServer: {
    contentBase: path.join(__dirname, `public`),
    historyApiFallback: true,
    compress: false,
    overlay: true,
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: `babel-loader`,
      },
    }, { // sass|scss
      test: /\.(scss|sass)$/,
      use: [
        MiniCssExtractPlugin.loader,
        { // css-loader
          loader: `css-loader`,
          options: {
            sourceMap: true,
            url: false,
          },
        },

        `postcss-loader`,
        `csscomb-loader`,
        { // sass-loader
          loader: `sass-loader`,
          options: {
            sourceMap: true,
          },
        },
      ],
    }, { // css
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        { // css-loader
          loader: `css-loader`,
          options: {
            sourceMap: true,
            url: false,
          },
        },
        `postcss-loader`,
        `csscomb-loader`,
      ],
    }],
  },

  devtool: `eval`,
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `./css/style.bundle.css`,
    }),
  ],
};
