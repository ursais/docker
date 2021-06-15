import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import LinearInterpolator from '../transitions/linear-interpolator';
import Transition from '../transitions/transition';
import assert from '../utils/assert';

var noop = function noop() {};

export var TRANSITION_EVENTS = {
  BREAK: 1,
  SNAP_TO_END: 2,
  IGNORE: 3
};
var DEFAULT_PROPS = {
  transitionDuration: 0,
  transitionEasing: function transitionEasing(t) {
    return t;
  },
  transitionInterpolator: new LinearInterpolator(),
  transitionInterruption: TRANSITION_EVENTS.BREAK,
  onTransitionStart: noop,
  onTransitionInterrupt: noop,
  onTransitionEnd: noop
};

var TransitionManager = function () {
  function TransitionManager(ControllerState) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TransitionManager);

    assert(ControllerState);
    this.ControllerState = ControllerState;
    this.props = Object.assign({}, DEFAULT_PROPS, props);
    this.propsInTransition = null;
    this.time = 0;
    this.transition = new Transition();
    this.onViewStateChange = props.onViewStateChange;
    this._onTransitionUpdate = this._onTransitionUpdate.bind(this);
  }

  _createClass(TransitionManager, [{
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
      assert(this._isTransitionEnabled(endProps), 'Transition is not enabled');
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

export { TransitionManager as default };
TransitionManager.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=transition-manager.js.map