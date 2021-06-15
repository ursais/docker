import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import ScenegraphNode from './scenegraph-node';

var CameraNode = function (_ScenegraphNode) {
  _inherits(CameraNode, _ScenegraphNode);

  function CameraNode() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CameraNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CameraNode).call(this, props));
    _this.projectionMatrix = props.projectionMatrix;
    return _this;
  }

  return CameraNode;
}(ScenegraphNode);

export { CameraNode as default };
//# sourceMappingURL=camera-node.js.map