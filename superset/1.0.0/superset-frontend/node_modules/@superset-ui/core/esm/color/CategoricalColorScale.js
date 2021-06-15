/* eslint-disable no-dupe-class-members */
import { scaleOrdinal } from 'd3-scale';
import { ExtensibleFunction } from '../models';
import stringifyAndTrim from './stringifyAndTrim'; // Use type augmentation to correct the fact that
// an instance of CategoricalScale is also a function

class CategoricalColorScale extends ExtensibleFunction {
  /**
   * Constructor
   * @param {*} colors an array of colors
   * @param {*} parentForcedColors optional parameter that comes from parent
   * (usually CategoricalColorNamespace) and supersede this.forcedColors
   */
  constructor(colors, parentForcedColors) {
    super(value => this.getColor(value));
    this.colors = void 0;
    this.scale = void 0;
    this.parentForcedColors = void 0;
    this.forcedColors = void 0;
    this.colors = colors;
    this.scale = scaleOrdinal();
    this.scale.range(colors);
    this.parentForcedColors = parentForcedColors;
    this.forcedColors = {};
  }

  getColor(value) {
    const cleanedValue = stringifyAndTrim(value);
    const parentColor = this.parentForcedColors && this.parentForcedColors[cleanedValue];

    if (parentColor) {
      return parentColor;
    }

    const forcedColor = this.forcedColors[cleanedValue];

    if (forcedColor) {
      return forcedColor;
    }

    return this.scale(cleanedValue);
  }
  /**
   * Enforce specific color for given value
   * @param {*} value value
   * @param {*} forcedColor forcedColor
   */


  setColor(value, forcedColor) {
    this.forcedColors[stringifyAndTrim(value)] = forcedColor;
    return this;
  }
  /**
   * Get a mapping of data values to colors
   * @returns an object where the key is the data value and the value is the hex color code
   */


  getColorMap() {
    const colorMap = {};
    this.scale.domain().forEach(value => {
      colorMap[value.toString()] = this.scale(value);
    });
    return { ...colorMap,
      ...this.forcedColors,
      ...this.parentForcedColors
    };
  }
  /**
   * Returns an exact copy of this scale. Changes to this scale will not affect the returned scale, and vice versa.
   */


  copy() {
    const copy = new CategoricalColorScale(this.scale.range(), this.parentForcedColors);
    copy.forcedColors = { ...this.forcedColors
    };
    copy.domain(this.domain());
    copy.unknown(this.unknown());
    return copy;
  }
  /**
   * Returns the scale's current domain.
   */


  domain(newDomain) {
    if (typeof newDomain === 'undefined') {
      return this.scale.domain();
    }

    this.scale.domain(newDomain);
    return this;
  }
  /**
   * Returns the scale's current range.
   */


  range(newRange) {
    if (typeof newRange === 'undefined') {
      return this.scale.range();
    }

    this.colors = newRange;
    this.scale.range(newRange);
    return this;
  }
  /**
   * Returns the current unknown value, which defaults to "implicit".
   */


  unknown(value) {
    if (typeof value === 'undefined') {
      return this.scale.unknown();
    }

    this.scale.unknown(value);
    return this;
  }

}

export default CategoricalColorScale;