"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("../lifecycle/constants");

var _createProps = require("../lifecycle/create-props");

var _componentState = _interopRequireDefault(require("./component-state"));

var defaultProps = {};
var counter = 0;

var Component = function () {
  function Component() {
    (0, _classCallCheck2.default)(this, Component);
    this.props = _createProps.createProps.apply(this, arguments);
    this.id = this.props.id;
    this.count = counter++;
    this.lifecycle = _constants.LIFECYCLE.NO_STATE;
    this.parent = null;
    this.context = null;
    this.state = null;
    this.internalState = null;
    Object.seal(this);
  }

  (0, _createClass2.default)(Component, [{
    key: "clone",
    value: function clone(newProps) {
      var props = this.props;
      var asyncProps = {};

      for (var key in props._asyncPropDefaultValues) {
        if (key in props._asyncPropResolvedValues) {
          asyncProps[key] = props._asyncPropResolvedValues[key];
        } else if (key in props._asyncPropOriginalValues) {
          asyncProps[key] = props._asyncPropOriginalValues[key];
        }
      }

      return new this.constructor(Object.assign({}, props, asyncProps, newProps));
    }
  }, {
    key: "_initState",
    value: function _initState() {
      this.internalState = new _componentState.default({});
    }
  }, {
    key: "stats",
    get: function get() {
      return this.internalState.stats;
    }
  }]);
  return Component;
}();

exports.default = Component;
Component.componentName = 'Component';
Component.defaultProps = defaultProps;
//# sourceMappingURL=component.js.map