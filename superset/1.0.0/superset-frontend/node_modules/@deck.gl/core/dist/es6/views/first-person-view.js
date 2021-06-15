import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4, _SphericalCoordinates as SphericalCoordinates } from 'math.gl';
import FirstPersonController from '../controllers/first-person-controller';

function getDirectionFromBearingAndPitch(_ref) {
  let bearing = _ref.bearing,
      pitch = _ref.pitch;
  const spherical = new SphericalCoordinates({
    bearing,
    pitch
  });
  const direction = spherical.toVector3().normalize();
  return direction;
}

export default class FirstPersonView extends View {
  get controller() {
    return this._getControllerProps({
      type: FirstPersonController
    });
  }

  _getViewport(props) {
    const _props$viewState = props.viewState,
          _props$viewState$mode = _props$viewState.modelMatrix,
          modelMatrix = _props$viewState$mode === void 0 ? null : _props$viewState$mode,
          bearing = _props$viewState.bearing,
          _props$viewState$up = _props$viewState.up,
          up = _props$viewState$up === void 0 ? [0, 0, 1] : _props$viewState$up;
    const dir = getDirectionFromBearingAndPitch({
      bearing,
      pitch: 89
    });
    const center = modelMatrix ? modelMatrix.transformDirection(dir) : dir;
    const viewMatrix = new Matrix4().lookAt({
      eye: [0, 0, 0],
      center,
      up
    });
    return new Viewport(Object.assign({}, props, {
      zoom: null,
      viewMatrix
    }));
  }

}
FirstPersonView.displayName = 'FirstPersonView';
//# sourceMappingURL=first-person-view.js.map