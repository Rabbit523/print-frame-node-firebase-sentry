const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const modeCondfig = env => require(`./build-tools/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  const config = webpackMerge(
    {
      target: 'node',
      node: {
        __filename: true,
        __dirname: true,
      },

      module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
            exclude: /node_modules/,
          },
          {
            test: /\.js?$/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
            exclude: /node_modules/,
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            use: {
              loader: 'raw-loader',
            },
          },
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },
          {
            test: /\.node$/,
            use: 'node-loader',
          },
        ],
      },
      resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        // Without this ts files won't load
        extensions: ['.webpack.js', '.web.js', '.mjs', '.js', '.json', '.ts'],
        alias: {
          deepmerge$: 'deepmerge/dist/umd.js',
        },
      },
      plugins: [new webpack.ProgressPlugin()],
    },
    modeCondfig(mode),
  );
  // console.log(JSON.stringify(config, null, 4));
  return config;
};
