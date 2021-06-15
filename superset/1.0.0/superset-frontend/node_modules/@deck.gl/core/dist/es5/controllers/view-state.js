"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _math = require("math.gl");

var _assert = _interopRequireDefault(require("../utils/assert"));

var defaultState = {
  position: [0, 0, 0],
  lookAt: [0, 0, 0],
  up: [0, 0, 1],
  rotationX: 0,
  rotationY: 0,
  fov: 50,
  near: 1,
  far: 100
};

var ViewState = function () {
  function ViewState(opts) {
    (0, _classCallCheck2.default)(this, ViewState);
    var width = opts.width,
        height = opts.height,
        _opts$position = opts.position,
        position = _opts$position === void 0 ? defaultState.position : _opts$position;
    (0, _assert.default)(Number.isFinite(width), '`width` must be supplied');
    (0, _assert.default)(Number.isFinite(height), '`height` must be supplied');
    this._viewportProps = this._applyConstraints(Object.assign({}, opts, {
      position: new _math.Vector3(position)
    }));
  }

  (0, _createClass2.default)(ViewState, [{
    key: "getViewportProps",
    value: function getViewportProps() {
      return this._viewportProps;
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      var spherical = new _math._SphericalCoordinates({
        bearing: this._viewportProps.bearing,
        pitch: this._viewportProps.pitch
      });
      var direction = spherical.toVector3().normalize();
      return direction;
    }
  }, {
    key: "getDirectionFromBearing",
    value: function getDirectionFromBearing(bearing) {
      var spherical = new _math._SphericalCoordinates({
        bearing: bearing,
        pitch: 90
      });
      var direction = spherical.toVector3().normalize();
      return direction;
    }
  }, {
    key: "shortestPathFrom",
    value: function shortestPathFrom(viewState) {
      return this._viewportProps;
    }
  }, {
    key: "_applyConstraints",
    value: function _applyConstraints(props) {
      return props;
    }
  }]);
  return ViewState;
}();

exports.default = ViewState;
//# sourceMappingURL=view-state.js.map