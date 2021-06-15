import { equals } from 'math.gl';
import assert from '../utils/assert';
export default class TransitionInterpolator {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (Array.isArray(opts)) {
      opts = {
        compare: opts,
        extract: opts,
        required: opts
      };
    }

    const _opts = opts,
          compare = _opts.compare,
          extract = _opts.extract,
          required = _opts.required;
    this._propsToCompare = compare;
    this._propsToExtract = extract;
    this._requiredProps = required;
  }

  arePropsEqual(currentProps, nextProps) {
    for (const key of this._propsToCompare || Object.keys(nextProps)) {
      if (!equals(currentProps[key], nextProps[key])) {
        return false;
      }
    }

    return true;
  }

  initializeProps(startProps, endProps) {
    let result;

    if (this._propsToExtract) {
      const startViewStateProps = {};
      const endViewStateProps = {};

      for (const key of this._propsToExtract) {
        startViewStateProps[key] = startProps[key];
        endViewStateProps[key] = endProps[key];
      }

      result = {
        start: startViewStateProps,
        end: endViewStateProps
      };
    } else {
      result = {
        start: startProps,
        end: endProps
      };
    }

    this._checkRequiredProps(result.start);

    this._checkRequiredProps(result.end);

    return result;
  }

  interpolateProps(startProps, endProps, t) {
    assert(false, 'interpolateProps is not implemented');
  }

  _checkRequiredProps(props) {
    if (!this._requiredProps) {
      return;
    }

    this._requiredProps.forEach(propName => {
      const value = props[propName];
      assert(Number.isFinite(value) || Array.isArray(value), `${propName} is required for transition`);
    });
  }

}
//# sourceMappingURL=transition-interpolator.js.map