import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { ArcLayer } from '@deck.gl/layers';
import vs from './great-circle-vertex.glsl';

var GreatCircleLayer = function (_ArcLayer) {
  _inherits(GreatCircleLayer, _ArcLayer);

  function GreatCircleLayer() {
    _classCallCheck(this, GreatCircleLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(GreatCircleLayer).apply(this, arguments));
  }

  _createClass(GreatCircleLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = Object.assign({}, _get(_getPrototypeOf(GreatCircleLayer.prototype), "getShaders", this).call(this), {
        vs: vs,
        modules: ['picking', 'project32']
      });
      return shaders;
    }
  }]);

  return GreatCircleLayer;
}(ArcLayer);

export { GreatCircleLayer as default };
GreatCircleLayer.layerName = 'GreatCircleLayer';
//# sourceMappingURL=great-circle-layer.js.map