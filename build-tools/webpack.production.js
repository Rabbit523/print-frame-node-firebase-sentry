const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = () => ({
  entry: ["./src/index"],
  devtool: "cheap-source-map",
  target: "node",
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    minimize: false
  },
  mode: "production",
  module: {},
  plugins: [],
  // Workaround for ws module trying to require devDependencies
  externals: [ "utf-8-validate", "bufferutil",{
    formidable: 'commonjs formidable',
}],
  output: { path: path.join(__dirname, "/../out"), filename: "server.js" }
});
