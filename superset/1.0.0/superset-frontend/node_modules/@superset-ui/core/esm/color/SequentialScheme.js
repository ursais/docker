import { scaleLinear } from 'd3-scale';
import { interpolateHcl, interpolateNumber, piecewise, quantize } from 'd3-interpolate';
import ColorScheme from './ColorScheme';
export default class SequentialScheme extends ColorScheme {
  constructor(config) {
    super(config);
    this.isDiverging = void 0;
    const {
      isDiverging = false
    } = config;
    this.isDiverging = isDiverging;
  }
  /**
   * Return a linear scale with a new domain interpolated from the input domain
   * to match the number of elements in the color scheme
   * because D3 continuous scale uses piecewise mapping between domain and range.
   * This is a common use-case when the domain is [min, max]
   * and the palette has more than two colors.
   *
   * @param domain domain of the scale
   * @param modifyRange Set this to true if you don't want to modify the domain and
   * want to interpolate range to have the same number of elements with domain instead.
   */


  createLinearScale(domain = [0, 1], modifyRange = false) {
    const scale = scaleLinear().interpolate(interpolateHcl).clamp(true);
    return modifyRange || domain.length === this.colors.length ? scale.domain(domain).range(this.getColors(domain.length)) : scale.domain(quantize(piecewise(interpolateNumber, domain), this.colors.length)).range(this.colors);
  }
  /**
   * Get colors from this scheme
   * @param numColors number of colors to return.
   * Will interpolate the current scheme to match the number of colors requested
   * @param extent The extent of the color range to use.
   * For example [0.2, 1] will rescale the color scheme
   * such that color values in the range [0, 0.2) are excluded from the scheme.
   */


  getColors(numColors = this.colors.length, extent = [0, 1]) {
    if (numColors === this.colors.length && extent[0] === 0 && extent[1] === 1) {
      return this.colors;
    }

    const piecewiseScale = piecewise(interpolateHcl, this.colors);
    const adjustExtent = scaleLinear().range(extent).clamp(true);
    return quantize(t => piecewiseScale(adjustExtent(t)), numColors);
  }

}