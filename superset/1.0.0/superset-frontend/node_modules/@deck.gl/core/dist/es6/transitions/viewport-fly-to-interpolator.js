import TransitionInterpolator from './transition-interpolator';
import { lerp } from 'math.gl';
import { flyToViewport } from 'viewport-mercator-project';
const LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];
export default class FlyToInterpolator extends TransitionInterpolator {
  constructor() {
    super({
      compare: ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      extract: ['width', 'height', 'longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      required: ['width', 'height', 'latitude', 'longitude', 'zoom']
    });
  }

  interpolateProps(startProps, endProps, t) {
    const viewport = flyToViewport(startProps, endProps, t);

    for (const key of LINEARLY_INTERPOLATED_PROPS) {
      viewport[key] = lerp(startProps[key] || 0, endProps[key] || 0, t);
    }

    return viewport;
  }

}
//# sourceMappingURL=viewport-fly-to-interpolator.js.map