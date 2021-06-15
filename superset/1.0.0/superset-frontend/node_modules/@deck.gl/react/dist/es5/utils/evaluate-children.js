"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = evaluateChildren;

var _react = require("react");

function evaluateChildren(children, childProps) {
  if (!children) {
    return children;
  }

  if (typeof children === 'function') {
    return children(childProps);
  }

  if (Array.isArray(children)) {
    return children.map(function (child) {
      return evaluateChildren(child, childProps);
    });
  }

  return (0, _react.cloneElement)(children, childProps);
}
//# sourceMappingURL=evaluate-children.js.map