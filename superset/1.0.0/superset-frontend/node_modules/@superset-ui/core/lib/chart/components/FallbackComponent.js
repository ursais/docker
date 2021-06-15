"use strict";

exports.__esModule = true;
exports.default = FallbackComponent;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONTAINER_STYLE = {
  backgroundColor: '#000',
  color: '#fff',
  overflow: 'auto',
  padding: 32
};

function FallbackComponent({
  componentStack,
  error,
  height,
  width
}) {
  return (0, _react2.jsx)("div", {
    style: { ...CONTAINER_STYLE,
      height,
      width
    }
  }, (0, _react2.jsx)("div", null, (0, _react2.jsx)("div", null, (0, _react2.jsx)("b", null, "Oops! An error occured!")), (0, _react2.jsx)("code", null, error ? error.toString() : 'Unknown Error')), componentStack && (0, _react2.jsx)("div", null, (0, _react2.jsx)("b", null, "Stack Trace:"), (0, _react2.jsx)("code", null, componentStack.split('\n').map(row => (0, _react2.jsx)("div", {
    key: row
  }, row)))));
}