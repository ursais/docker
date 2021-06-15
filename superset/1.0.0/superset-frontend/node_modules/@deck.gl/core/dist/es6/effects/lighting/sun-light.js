import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { DirectionalLight } from '@luma.gl/core';
import { getSunlightDirection } from './suncalc';
export default class SunLight extends DirectionalLight {
  constructor(_ref) {
    let timestamp = _ref.timestamp,
        others = _objectWithoutProperties(_ref, ["timestamp"]);

    super(others);
    this.timestamp = timestamp;
  }

  getProjectedLight(_ref2) {
    let layer = _ref2.layer;
    const _layer$context$viewpo = layer.context.viewport,
          latitude = _layer$context$viewpo.latitude,
          longitude = _layer$context$viewpo.longitude;
    this.direction = getSunlightDirection(this.timestamp, latitude, longitude);
    return this;
  }

}
//# sourceMappingURL=sun-light.js.map