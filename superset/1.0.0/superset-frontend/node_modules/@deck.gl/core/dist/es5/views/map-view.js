"use strict";

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

var _webMercatorViewport = _interopRequireDefault(require("../viewports/web-mercator-viewport"));

var _mapController = _interopRequireDefault(require("../controllers/map-controller"));

var MapView = function (_View) {
  (0, _inherits2.default)(MapView, _View);

  function MapView(props) {
    (0, _classCallCheck2.default)(this, MapView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(MapView).call(this, Object.assign({}, props, {
      type: _webMercatorViewport.default
    })));
  }

  (0, _createClass2.default)(MapView, [{
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: _mapController.default
      });
    }
  }]);
  return MapView;
}(_view.default);

exports.default = MapView;
MapView.displayName = 'MapView';
//# sourceMappingURL=map-view.js.map