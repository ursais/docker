import PointLight from './point-light';
import { getUniformsFromViewport } from '../../shaderlib/project/viewport-uniforms';
export default class CameraLight extends PointLight {
  getProjectedLight(_ref) {
    let layer = _ref.layer;
    const viewport = layer.context.viewport;
    const _layer$props = layer.props,
          coordinateSystem = _layer$props.coordinateSystem,
          coordinateOrigin = _layer$props.coordinateOrigin,
          modelMatrix = _layer$props.modelMatrix;

    const _getUniformsFromViewp = getUniformsFromViewport({
      viewport,
      modelMatrix,
      coordinateSystem,
      coordinateOrigin
    }),
          project_uCameraPosition = _getUniformsFromViewp.project_uCameraPosition;

    this.projectedLight.color = this.color;
    this.projectedLight.intensity = this.intensity;
    this.projectedLight.position = project_uCameraPosition;
    return this.projectedLight;
  }

}
//# sourceMappingURL=camera-light.js.map