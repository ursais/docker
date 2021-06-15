import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

const defaultGetValue = points => points.length;

export default class BinSorter {
  constructor() {
    let bins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let getValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetValue;
    this.sortedBins = this.getSortedBins(bins, getValue);
    this.maxCount = this.getMaxCount();
    this.binMap = this.getBinMap();
  }

  getSortedBins(bins, getValue) {
    return bins.reduce((accu, h, i) => {
      const value = getValue(h.points);

      if (value !== null && value !== undefined) {
        accu.push({
          i: Number.isFinite(h.index) ? h.index : i,
          value,
          counts: h.points.length
        });
      }

      return accu;
    }, []).sort((a, b) => a.value - b.value);
  }

  getValueRange(_ref) {
    let _ref2 = _slicedToArray(_ref, 2),
        lower = _ref2[0],
        upper = _ref2[1];

    const len = this.sortedBins.length;

    if (!len) {
      return [0, 0];
    }

    const lowerIdx = Math.ceil(lower / 100 * (len - 1));
    const upperIdx = Math.floor(upper / 100 * (len - 1));
    return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
  }

  getMaxCount() {
    let maxCount = 0;
    this.sortedBins.forEach(x => maxCount = maxCount > x.counts ? maxCount : x.counts);
    return maxCount;
  }

  getBinMap() {
    return this.sortedBins.reduce((mapper, curr) => Object.assign(mapper, {
      [curr.i]: curr
    }), {});
  }

}
//# sourceMappingURL=bin-sorter.js.map