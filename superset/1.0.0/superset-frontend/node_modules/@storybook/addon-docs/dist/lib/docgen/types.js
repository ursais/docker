"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PropDef", {
  enumerable: true,
  get: function get() {
    return _PropDef.PropDef;
  }
});
exports.TypeSystem = void 0;

var _PropDef = require("./PropDef");

var TypeSystem;
exports.TypeSystem = TypeSystem;

(function (TypeSystem) {
  TypeSystem["JAVASCRIPT"] = "JavaScript";
  TypeSystem["FLOW"] = "Flow";
  TypeSystem["TYPESCRIPT"] = "TypeScript";
  TypeSystem["UNKNOWN"] = "Unknown";
})(TypeSystem || (exports.TypeSystem = TypeSystem = {}));