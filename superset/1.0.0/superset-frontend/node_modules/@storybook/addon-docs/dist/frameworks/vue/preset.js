"use strict";

require("core-js/modules/es.object.assign");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackFinal = webpackFinal;

function webpackFinal() {
  var webpackConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-docgen-loader', {
      paths: [require.resolve('@storybook/vue')]
    }),
    enforce: 'post',
    options: {
      docgenOptions: Object.assign({
        alias: webpackConfig.resolve.alias
      }, options.vueDocgenOptions)
    }
  });
  return webpackConfig;
}