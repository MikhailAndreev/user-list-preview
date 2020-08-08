const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`); // добавляем хэш только при продакшн сборке

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: isDev, reloadAll: true },
    },
    "css-loader",
  ];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }
  console.log(loaders);
  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  // entry: "./src/index.js", // входной файл приложения
  entry: {
    // так как у нас может быть несколько входных точек мы можем передать объект с этими точками
    main: ["@babel/polyfill", "./index.jsx"],
    analytics: "./analytics.ts",
  },
  output: {
    // filename: "[name].bundle.js", // файл в который нужно все скомпилиь
    // filename: "[name].[hash].js", // для динамической генерации имен, которая зависит от контента файла
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".jpg", ".jsx", '.svg'], // устанавливаем расширения, которые WP будет обрабатывать автоматом
    alias: {
      "@images": path.resolve(__dirname, "src/assets/images"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  // optimization: { splitChunks: { chunks: "all" } },
  optimization: optimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html", // чтобы WP сохранил контент внутри index.html + автоматическое подключение скриптов
      minify: {
        collapseWhitespace: isProd, // минифицирует HTML
      },
    }),
    new CleanWebpackPlugin(), // очищает папку /dist от файлов которые были изменены
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // filename: "[name].[hash].css",
      filename: filename("css"),
    }),
  ],
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? "source-map" : "",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
        // loader: {
        //   loader: "babel-loader",
        //   options: babelOptions(),
        // },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
};
