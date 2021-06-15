import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4 } from 'math.gl';
import OrthographicController from '../controllers/orthographic-controller';
const viewMatrix = new Matrix4().lookAt({
  eye: [0, 0, 1]
});

function getProjectionMatrix(_ref) {
  let width = _ref.width,
      height = _ref.height,
      near = _ref.near,
      far = _ref.far;
  width = width || 1;
  height = height || 1;
  return new Matrix4().ortho({
    left: -width / 2,
    right: width / 2,
    bottom: height / 2,
    top: -height / 2,
    near,
    far
  });
}

class OrthographicViewport extends Viewport {
  constructor(_ref2) {
    let id = _ref2.id,
        x = _ref2.x,
        y = _ref2.y,
        width = _ref2.width,
        height = _ref2.height,
        _ref2$near = _ref2.near,
        near = _ref2$near === void 0 ? 0.1 : _ref2$near,
        _ref2$far = _ref2.far,
        far = _ref2$far === void 0 ? 1000 : _ref2$far,
        _ref2$zoom = _ref2.zoom,
        zoom = _ref2$zoom === void 0 ? 0 : _ref2$zoom,
        _ref2$target = _ref2.target,
        target = _ref2$target === void 0 ? [0, 0, 0] : _ref2$target;
    return new Viewport({
      id,
      x,
      y,
      width,
      height,
      position: target,
      viewMatrix,
      projectionMatrix: getProjectionMatrix({
        width,
        height,
        near,
        far
      }),
      zoom
    });
  }

}

export default class OrthographicView extends View {
  constructor(props) {
    super(Object.assign({}, props, {
      type: OrthographicViewport
    }));
  }

  get controller() {
    return this._getControllerProps({
      type: OrthographicController,
      ViewportType: OrthographicViewport
    });
  }

}
OrthographicView.displayName = 'OrthographicView';
//# sourceMappingURL=orthographic-view.js.map