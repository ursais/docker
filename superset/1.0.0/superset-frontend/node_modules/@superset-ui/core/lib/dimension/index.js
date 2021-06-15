"use strict";

exports.__esModule = true;
var _exportNames = {
  getTextDimension: true,
  getMultipleTextDimensions: true,
  computeMaxFontSize: true,
  mergeMargin: true,
  parseLength: true,
  __hack_reexport_dimension: true
};
exports.__hack_reexport_dimension = exports.parseLength = exports.mergeMargin = exports.computeMaxFontSize = exports.getMultipleTextDimensions = exports.getTextDimension = void 0;

var _getTextDimension = _interopRequireDefault(require("./getTextDimension"));

exports.getTextDimension = _getTextDimension.default;

var _getMultipleTextDimensions = _interopRequireDefault(require("./getMultipleTextDimensions"));

exports.getMultipleTextDimensions = _getMultipleTextDimensions.default;

var _computeMaxFontSize = _interopRequireDefault(require("./computeMaxFontSize"));

exports.computeMaxFontSize = _computeMaxFontSize.default;

var _mergeMargin = _interopRequireDefault(require("./mergeMargin"));

exports.mergeMargin = _mergeMargin.default;

var _parseLength = _interopRequireDefault(require("./parseLength"));

exports.parseLength = _parseLength.default;

var _types = _interopRequireWildcard(require("./types"));

exports.__hack_reexport_dimension = _types.default;
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  exports[key] = _types[key];
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }