"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TRANSITION_EVENTS = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _linearInterpolator = _interopRequireDefault(require("../transitions/linear-interpolator"));

var _transition = _interopRequireDefault(require("../transitions/transition"));

var _assert = _interopRequireDefault(require("../utils/assert"));

var noop = function noop() {};

var TRANSITION_EVENTS = {
  BREAK: 1,
  SNAP_TO_END: 2,
  IGNORE: 3
};
exports.TRANSITION_EVENTS = TRANSITION_EVENTS;
var DEFAULT_PROPS = {
  transitionDuration: 0,
  transitionEasing: function transitionEasing(t) {
    return t;
  },
  transitionInterpolator: new _linearInterpolator.default(),
  transitionInterruption: TRANSITION_EVENTS.BREAK,
  onTransitionStart: noop,
  onTransitionInterrupt: noop,
  onTransitionEnd: noop
};

var TransitionManager = function () {
  function TransitionManager(ControllerState) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, TransitionManager);
    (0, _assert.default)(ControllerState);
    this.ControllerState = ControllerState;
    this.props = Object.assign({}, DEFAULT_PROPS, props);
    this.propsInTransition = null;
    this.time = 0;
    this.transition = new _transition.default();
    this.onViewStateChange = props.onViewStateChange;
    this._onTransitionUpdate = this._onTransitionUpdate.bind(this);
  }

  (0, _createClass2.default)(TransitionManager, [{
    key: "finalize",
    value: function finalize() {}
  }, {
    key: "getViewportInTransition",
    value: function getViewportInTransition() {
      return this.propsInTransition;
    }
  }, {
    key: "processViewStateChange",
    value: function processViewStateChange(nextProps) {
      var transitionTriggered = false;
      var currentProps = this.props;
      nextProps = Object.assign({}, DEFAULT_PROPS, nextProps);
      this.props = nextProps;

      if (this._shouldIgnoreViewportChange(currentProps, nextProps)) {
        return transitionTriggered;
      }

      if (this._isTransitionEnabled(nextProps)) {
        var startProps = Object.assign({}, currentProps, this.transition.interruption === TRANSITION_EVENTS.SNAP_TO_END ? this.transition.endProps : this.propsInTransition || currentProps);

        this._triggerTransition(startProps, nextProps);

        transitionTriggered = true;
      } else {
        this.transition.cancel();
      }

      return transitionTriggered;
    }
  }, {
    key: "updateTransition",
    value: function updateTransition(timestamp) {
      this.time = timestamp;

      this._updateTransition();
    }
  }, {
    key: "_isTransitionEnabled",
    value: function _isTransitionEnabled(props) {
      return props.transitionDuration > 0 && props.transitionInterpolator;
    }
  }, {
    key: "_isUpdateDueToCurrentTransition",
    value: function _isUpdateDueToCurrentTransition(props) {
      if (this.transition.inProgress) {
        return this.transition.interpolator.arePropsEqual(props, this.propsInTransition);
      }

      return false;
    }
  }, {
    key: "_shouldIgnoreViewportChange",
    value: function _shouldIgnoreViewportChange(currentProps, nextProps) {
      if (this.transition.inProgress) {
        return this.transition.interruption === TRANSITION_EVENTS.IGNORE || this._isUpdateDueToCurrentTransition(nextProps);
      } else if (this._isTransitionEnabled(nextProps)) {
        return nextProps.transitionInterpolator.arePropsEqual(currentProps, nextProps);
      }

      return true;
    }
  }, {
    key: "_triggerTransition",
    value: function _triggerTransition(startProps, endProps) {
      (0, _assert.default)(this._isTransitionEnabled(endProps), 'Transition is not enabled');
      var startViewstate = new this.ControllerState(startProps);
      var endViewStateProps = new this.ControllerState(endProps).shortestPathFrom(startViewstate);
      var initialProps = endProps.transitionInterpolator.initializeProps(startProps, endViewStateProps);
      this.propsInTransition = {};
      this.transition.start({
        duration: endProps.transitionDuration,
        easing: endProps.transitionEasing,
        interpolator: endProps.transitionInterpolator,
        interruption: endProps.transitionInterruption,
        startProps: initialProps.start,
        endProps: initialProps.end,
        onStart: endProps.onTransitionStart,
        onUpdate: this._onTransitionUpdate,
        onInterrupt: this._onTransitionEnd(endProps.onTransitionInterrupt),
        onEnd: this._onTransitionEnd(endProps.onTransitionEnd)
      });

      this._updateTransition();
    }
  }, {
    key: "_updateTransition",
    value: function _updateTransition() {
      this.transition.update(this.time);
    }
  }, {
    key: "_onTransitionEnd",
    value: function _onTransitionEnd(callback) {
      var _this = this;

      return function (transition) {
        _this.propsInTransition = null;
        callback(transition);
      };
    }
  }, {
    key: "_onTransitionUpdate",
    value: function _onTransitionUpdate(transition) {
      var interpolator = transition.interpolator,
          startProps = transition.startProps,
          endProps = transition.endProps,
          time = transition.time;
      var viewport = interpolator.interpolateProps(startProps, endProps, time);
      this.propsInTransition = new this.ControllerState(Object.assign({}, this.props, viewport)).getViewportProps();

      if (this.onViewStateChange) {
        this.onViewStateChange({
          viewState: this.propsInTransition,
          interactionState: {
            inTransition: true
          }
        });
      }
    }
  }]);
  return TransitionManager;
}();

exports.default = TransitionManager;
TransitionManager.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=transition-manager.js.map