module.exports = {
  // css: {
  //   additionalData: {
  //     sass: {
  //       prependData: '@import "@/assets/styles/app.scss";'
  //     }
  //   }
  // },

  configureWebpack: config => {
    config.resolve.fallback = {
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify")
    }
  },

  productionSourceMap: false
};
