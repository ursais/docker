import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import WebMercatorViewport from '../viewports/web-mercator-viewport';
import MapController from '../controllers/map-controller';

var MapView = function (_View) {
  _inherits(MapView, _View);

  function MapView(props) {
    _classCallCheck(this, MapView);

    return _possibleConstructorReturn(this, _getPrototypeOf(MapView).call(this, Object.assign({}, props, {
      type: WebMercatorViewport
    })));
  }

  _createClass(MapView, [{
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: MapController
      });
    }
  }]);

  return MapView;
}(View);

export { MapView as default };
MapView.displayName = 'MapView';
//# sourceMappingURL=map-view.js.map