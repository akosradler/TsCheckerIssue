const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = function (env) {
  return {
    mode: env,
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    output: {
      path: path.resolve(__dirname, "build"),
      globalObject: "this",
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, "tsconfig.json"),
          build: true,
          mode: "write-references",
        },
        async: false,
      }),
    ],
  };
};
