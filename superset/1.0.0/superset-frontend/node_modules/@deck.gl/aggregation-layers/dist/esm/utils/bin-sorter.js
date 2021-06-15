import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var defaultGetValue = function defaultGetValue(points) {
  return points.length;
};

var BinSorter = function () {
  function BinSorter() {
    var bins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var getValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetValue;

    _classCallCheck(this, BinSorter);

    this.sortedBins = this.getSortedBins(bins, getValue);
    this.maxCount = this.getMaxCount();
    this.binMap = this.getBinMap();
  }

  _createClass(BinSorter, [{
    key: "getSortedBins",
    value: function getSortedBins(bins, getValue) {
      return bins.reduce(function (accu, h, i) {
        var value = getValue(h.points);

        if (value !== null && value !== undefined) {
          accu.push({
            i: Number.isFinite(h.index) ? h.index : i,
            value: value,
            counts: h.points.length
          });
        }

        return accu;
      }, []).sort(function (a, b) {
        return a.value - b.value;
      });
    }
  }, {
    key: "getValueRange",
    value: function getValueRange(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          lower = _ref2[0],
          upper = _ref2[1];

      var len = this.sortedBins.length;

      if (!len) {
        return [0, 0];
      }

      var lowerIdx = Math.ceil(lower / 100 * (len - 1));
      var upperIdx = Math.floor(upper / 100 * (len - 1));
      return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
    }
  }, {
    key: "getMaxCount",
    value: function getMaxCount() {
      var maxCount = 0;
      this.sortedBins.forEach(function (x) {
        return maxCount = maxCount > x.counts ? maxCount : x.counts;
      });
      return maxCount;
    }
  }, {
    key: "getBinMap",
    value: function getBinMap() {
      return this.sortedBins.reduce(function (mapper, curr) {
        return Object.assign(mapper, _defineProperty({}, curr.i, curr));
      }, {});
    }
  }]);

  return BinSorter;
}();

export { BinSorter as default };
//# sourceMappingURL=bin-sorter.js.map