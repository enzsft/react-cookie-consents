/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./example/index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./example/index.html",
    }),
  ],
};
