"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _view = _interopRequireDefault(require("./view"));

var _viewport = _interopRequireDefault(require("../viewports/viewport"));

var mat4 = _interopRequireWildcard(require("gl-matrix/mat4"));

var DEGREES_TO_RADIANS = Math.PI / 180;

var PerspectiveView = function (_View) {
  (0, _inherits2.default)(PerspectiveView, _View);

  function PerspectiveView() {
    (0, _classCallCheck2.default)(this, PerspectiveView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PerspectiveView).apply(this, arguments));
  }

  (0, _createClass2.default)(PerspectiveView, [{
    key: "_getViewport",
    value: function _getViewport(props) {
      var x = props.x,
          y = props.y,
          width = props.width,
          height = props.height,
          viewState = props.viewState;
      var eye = viewState.eye,
          _viewState$lookAt = viewState.lookAt,
          lookAt = _viewState$lookAt === void 0 ? [0, 0, 0] : _viewState$lookAt,
          _viewState$up = viewState.up,
          up = _viewState$up === void 0 ? [0, 1, 0] : _viewState$up;
      var fovy = props.fovy || viewState.fovy || 75;
      var near = props.near || viewState.near || 1;
      var far = props.far || viewState.far || 100;
      var aspect = Number.isFinite(viewState.aspect) ? viewState.aspect : width / height;
      var fovyRadians = fovy * DEGREES_TO_RADIANS;
      return new _viewport.default({
        id: this.id,
        x: x,
        y: y,
        width: width,
        height: height,
        viewMatrix: mat4.lookAt([], eye, lookAt, up),
        projectionMatrix: mat4.perspective([], fovyRadians, aspect, near, far)
      });
    }
  }]);
  return PerspectiveView;
}(_view.default);

exports.default = PerspectiveView;
PerspectiveView.displayName = 'PerspectiveView';
//# sourceMappingURL=perspective-view.js.map