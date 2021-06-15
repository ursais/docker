import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Vector3, _SphericalCoordinates as SphericalCoordinates } from 'math.gl';
import assert from '../utils/assert';
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
    _classCallCheck(this, ViewState);

    var width = opts.width,
        height = opts.height,
        _opts$position = opts.position,
        position = _opts$position === void 0 ? defaultState.position : _opts$position;
    assert(Number.isFinite(width), '`width` must be supplied');
    assert(Number.isFinite(height), '`height` must be supplied');
    this._viewportProps = this._applyConstraints(Object.assign({}, opts, {
      position: new Vector3(position)
    }));
  }

  _createClass(ViewState, [{
    key: "getViewportProps",
    value: function getViewportProps() {
      return this._viewportProps;
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      var spherical = new SphericalCoordinates({
        bearing: this._viewportProps.bearing,
        pitch: this._viewportProps.pitch
      });
      var direction = spherical.toVector3().normalize();
      return direction;
    }
  }, {
    key: "getDirectionFromBearing",
    value: function getDirectionFromBearing(bearing) {
      var spherical = new SphericalCoordinates({
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

export { ViewState as default };
//# sourceMappingURL=view-state.js.map