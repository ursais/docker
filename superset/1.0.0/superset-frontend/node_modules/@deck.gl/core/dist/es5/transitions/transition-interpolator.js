"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _math = require("math.gl");

var _assert = _interopRequireDefault(require("../utils/assert"));

var TransitionInterpolator = function () {
  function TransitionInterpolator() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, TransitionInterpolator);

    if (Array.isArray(opts)) {
      opts = {
        compare: opts,
        extract: opts,
        required: opts
      };
    }

    var _opts = opts,
        compare = _opts.compare,
        extract = _opts.extract,
        required = _opts.required;
    this._propsToCompare = compare;
    this._propsToExtract = extract;
    this._requiredProps = required;
  }

  (0, _createClass2.default)(TransitionInterpolator, [{
    key: "arePropsEqual",
    value: function arePropsEqual(currentProps, nextProps) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (this._propsToCompare || Object.keys(nextProps))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!(0, _math.equals)(currentProps[key], nextProps[key])) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }, {
    key: "initializeProps",
    value: function initializeProps(startProps, endProps) {
      var result;

      if (this._propsToExtract) {
        var startViewStateProps = {};
        var endViewStateProps = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._propsToExtract[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;
            startViewStateProps[key] = startProps[key];
            endViewStateProps[key] = endProps[key];
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
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
  }, {
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      (0, _assert.default)(false, 'interpolateProps is not implemented');
    }
  }, {
    key: "_checkRequiredProps",
    value: function _checkRequiredProps(props) {
      if (!this._requiredProps) {
        return;
      }

      this._requiredProps.forEach(function (propName) {
        var value = props[propName];
        (0, _assert.default)(Number.isFinite(value) || Array.isArray(value), "".concat(propName, " is required for transition"));
      });
    }
  }]);
  return TransitionInterpolator;
}();

exports.default = TransitionInterpolator;
//# sourceMappingURL=transition-interpolator.js.map