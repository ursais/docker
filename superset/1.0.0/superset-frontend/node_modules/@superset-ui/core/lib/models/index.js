"use strict";

exports.__esModule = true;
exports.OverwritePolicy = exports.RegistryWithDefaultKey = exports.Registry = exports.Preset = exports.Plugin = exports.ExtensibleFunction = void 0;

var _ExtensibleFunction = _interopRequireDefault(require("./ExtensibleFunction"));

exports.ExtensibleFunction = _ExtensibleFunction.default;

var _Plugin = _interopRequireDefault(require("./Plugin"));

exports.Plugin = _Plugin.default;

var _Preset = _interopRequireDefault(require("./Preset"));

exports.Preset = _Preset.default;

var _Registry = _interopRequireWildcard(require("./Registry"));

exports.Registry = _Registry.default;
exports.OverwritePolicy = _Registry.OverwritePolicy;

var _RegistryWithDefaultKey = _interopRequireDefault(require("./RegistryWithDefaultKey"));

exports.RegistryWithDefaultKey = _RegistryWithDefaultKey.default;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }