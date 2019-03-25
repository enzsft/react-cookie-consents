module.exports = {
  presets: ["@babel/env", "@babel/typescript", "@babel/preset-react"],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
  ],
};
