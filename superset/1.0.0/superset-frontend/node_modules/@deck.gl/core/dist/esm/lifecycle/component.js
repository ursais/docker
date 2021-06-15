import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { LIFECYCLE } from '../lifecycle/constants';
import { createProps } from '../lifecycle/create-props';
import ComponentState from './component-state';
var defaultProps = {};
var counter = 0;

var Component = function () {
  function Component() {
    _classCallCheck(this, Component);

    this.props = createProps.apply(this, arguments);
    this.id = this.props.id;
    this.count = counter++;
    this.lifecycle = LIFECYCLE.NO_STATE;
    this.parent = null;
    this.context = null;
    this.state = null;
    this.internalState = null;
    Object.seal(this);
  }

  _createClass(Component, [{
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
      this.internalState = new ComponentState({});
    }
  }, {
    key: "stats",
    get: function get() {
      return this.internalState.stats;
    }
  }]);

  return Component;
}();

export { Component as default };
Component.componentName = 'Component';
Component.defaultProps = defaultProps;
//# sourceMappingURL=component.js.map