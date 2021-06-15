import TransitionInterpolator from './transition-interpolator';
import { lerp } from 'math.gl';
const VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
export default class LinearInterpolator extends TransitionInterpolator {
  constructor() {
    let transitionProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VIEWPORT_TRANSITION_PROPS;
    super(transitionProps);
  }

  interpolateProps(startProps, endProps, t) {
    const viewport = {};

    for (const key in endProps) {
      viewport[key] = lerp(startProps[key], endProps[key], t);
    }

    return viewport;
  }

}
//# sourceMappingURL=linear-interpolator.js.map