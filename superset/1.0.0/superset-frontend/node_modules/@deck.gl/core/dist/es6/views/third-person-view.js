import View from './view';
import Viewport from '../viewports/viewport';
import { Vector3, Matrix4, _SphericalCoordinates as SphericalCoordinates } from 'math.gl';

function getDirectionFromBearingAndPitch(_ref) {
  let bearing = _ref.bearing,
      pitch = _ref.pitch;
  const spherical = new SphericalCoordinates({
    bearing,
    pitch
  });
  return spherical.toVector3().normalize();
}

export default class ThirdPersonView extends View {
  _getViewport(props) {
    const _props$viewState = props.viewState,
          bearing = _props$viewState.bearing,
          pitch = _props$viewState.pitch,
          position = _props$viewState.position,
          up = _props$viewState.up,
          zoom = _props$viewState.zoom;
    const direction = getDirectionFromBearingAndPitch({
      bearing,
      pitch
    });
    const distance = zoom * 50;
    const eye = direction.scale(-distance).multiply(new Vector3(1, 1, -1));
    const viewMatrix = new Matrix4().multiplyRight(new Matrix4().lookAt({
      eye,
      center: position,
      up
    }));
    return new Viewport(Object.assign({}, props, {
      id: this.id,
      zoom: null,
      viewMatrix
    }));
  }

}
ThirdPersonView.displayName = 'ThirdPersonView';
//# sourceMappingURL=third-person-view.js.map