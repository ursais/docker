"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _scenegraphNode = _interopRequireDefault(require("./scenegraph-node"));

var CameraNode = function (_ScenegraphNode) {
  (0, _inherits2["default"])(CameraNode, _ScenegraphNode);

  function CameraNode() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, CameraNode);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CameraNode).call(this, props));
    _this.projectionMatrix = props.projectionMatrix;
    return _this;
  }

  return CameraNode;
}(_scenegraphNode["default"]);

exports["default"] = CameraNode;
//# sourceMappingURL=camera-node.js.map