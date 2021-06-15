import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
export var TRANSITION_STATE = {
  NONE: 'none',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  ENDED: 'ended'
};

function noop() {}

var Transition = function () {
  function Transition(props) {
    _classCallCheck(this, Transition);

    this._startTime = null;
    this._state = TRANSITION_STATE.NONE;
    this.duration = 1;

    this.easing = function (t) {
      return t;
    };

    this.onStart = noop;
    this.onUpdate = noop;
    this.onInterrupt = noop;
    this.onEnd = noop;
    Object.assign(this, props);
  }

  _createClass(Transition, [{
    key: "start",
    value: function start(props) {
      if (this.inProgress) {
        this.onInterrupt(this);
      }

      Object.assign(this, props);

      this._setState(TRANSITION_STATE.PENDING);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.inProgress) {
        this.onInterrupt(this);

        this._setState(TRANSITION_STATE.NONE);
      }
    }
  }, {
    key: "update",
    value: function update(currentTime) {
      if (this.state === TRANSITION_STATE.PENDING) {
        this._startTime = currentTime;

        this._setState(TRANSITION_STATE.IN_PROGRESS);
      }

      if (this.state === TRANSITION_STATE.IN_PROGRESS) {
        var shouldEnd = false;
        var time = (currentTime - this._startTime) / this.duration;

        if (time >= 1) {
          time = 1;
          shouldEnd = true;
        }

        this.time = this.easing(time);
        this.onUpdate(this);

        if (shouldEnd) {
          this._setState(TRANSITION_STATE.ENDED);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "_setState",
    value: function _setState(newState) {
      if (this._state === newState) {
        return;
      }

      this._state = newState;

      switch (newState) {
        case TRANSITION_STATE.PENDING:
          this.onStart(this);
          break;

        case TRANSITION_STATE.ENDED:
          this.onEnd(this);
          break;

        default:
      }
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "inProgress",
    get: function get() {
      return this._state === TRANSITION_STATE.PENDING || this._state === TRANSITION_STATE.IN_PROGRESS;
    }
  }]);

  return Transition;
}();

export { Transition as default };
//# sourceMappingURL=transition.js.map