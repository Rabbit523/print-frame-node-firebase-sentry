module.exports = {
    presets: [["@babel/preset-env"], "@babel/preset-typescript"],
    plugins: [
      "@babel/proposal-class-properties",
      ["@babel/plugin-transform-runtime"]
    ]
  };