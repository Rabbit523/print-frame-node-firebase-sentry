const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = () => ({
  entry: [
    "webpack/hot/poll?1000",
    path.resolve(__dirname, "./../src/index.ts")
  ],
  devtool: "sourcemap",
  watch: true,
  // devServer: {
  //   contentBase: path.join(__dirname, "./../dist"),
  //   filename: "server.js",
  //   port: 3000,
  //   hot: true
  // },
  externals: [nodeExternals({ whitelist: ["webpack/hot/poll?1000"] })],
  mode: "development",
  plugins: [
    new StartServerPlugin("server.js"),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ],
  //This is the path from here so it should go one level up
  output: { path: path.resolve(__dirname, "./../dist"), filename: "server.js" }
});
