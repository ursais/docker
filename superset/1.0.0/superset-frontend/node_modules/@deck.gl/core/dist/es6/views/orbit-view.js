import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4 } from 'math.gl';
import OrbitController from '../controllers/orbit-controller';
const DEGREES_TO_RADIANS = Math.PI / 180;

function getViewMatrix(_ref) {
  let height = _ref.height,
      fovy = _ref.fovy,
      orbitAxis = _ref.orbitAxis,
      rotationX = _ref.rotationX,
      rotationOrbit = _ref.rotationOrbit,
      zoom = _ref.zoom;
  const distance = 0.5 / Math.tan(fovy * DEGREES_TO_RADIANS / 2);
  const viewMatrix = new Matrix4().lookAt({
    eye: [0, 0, distance]
  });
  viewMatrix.rotateX(rotationX * DEGREES_TO_RADIANS);

  if (orbitAxis === 'Z') {
    viewMatrix.rotateZ(rotationOrbit * DEGREES_TO_RADIANS);
  } else {
    viewMatrix.rotateY(rotationOrbit * DEGREES_TO_RADIANS);
  }

  const projectionScale = 1 / (height || 1);
  viewMatrix.scale([projectionScale, projectionScale, projectionScale]);
  return viewMatrix;
}

class OrbitViewport extends Viewport {
  constructor(props) {
    const id = props.id,
          x = props.x,
          y = props.y,
          width = props.width,
          height = props.height,
          _props$fovy = props.fovy,
          fovy = _props$fovy === void 0 ? 50 : _props$fovy,
          near = props.near,
          far = props.far,
          _props$orbitAxis = props.orbitAxis,
          orbitAxis = _props$orbitAxis === void 0 ? 'Z' : _props$orbitAxis,
          _props$target = props.target,
          target = _props$target === void 0 ? [0, 0, 0] : _props$target,
          _props$rotationX = props.rotationX,
          rotationX = _props$rotationX === void 0 ? 0 : _props$rotationX,
          _props$rotationOrbit = props.rotationOrbit,
          rotationOrbit = _props$rotationOrbit === void 0 ? 0 : _props$rotationOrbit,
          _props$zoom = props.zoom,
          zoom = _props$zoom === void 0 ? 0 : _props$zoom;
    super({
      id,
      viewMatrix: getViewMatrix({
        height,
        fovy,
        orbitAxis,
        rotationX,
        rotationOrbit,
        zoom
      }),
      fovy,
      near,
      far,
      x,
      y,
      position: target,
      width,
      height,
      zoom
    });
  }

}

export default class OrbitView extends View {
  constructor(props) {
    super(Object.assign({}, props, {
      type: OrbitViewport
    }));
  }

  get controller() {
    return this._getControllerProps({
      type: OrbitController,
      ViewportType: OrbitViewport
    });
  }

}
OrbitView.displayName = 'OrbitView';
//# sourceMappingURL=orbit-view.js.map