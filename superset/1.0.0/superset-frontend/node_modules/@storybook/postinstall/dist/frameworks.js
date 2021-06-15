"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.object.assign");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFrameworks = void 0;
var FRAMEWORKS = ['angular', 'ember', 'html', 'marko', 'mithril', 'preact', 'rax', 'react', 'react-native', 'riot', 'svelte', 'vue', 'web-components'];

var getFrameworks = function getFrameworks(_ref) {
  var dependencies = _ref.dependencies,
      devDependencies = _ref.devDependencies;
  var allDeps = {};
  Object.assign(allDeps, dependencies || {});
  Object.assign(allDeps, devDependencies || {});
  return FRAMEWORKS.filter(function (f) {
    return !!allDeps["@storybook/".concat(f)];
  });
};

exports.getFrameworks = getFrameworks;