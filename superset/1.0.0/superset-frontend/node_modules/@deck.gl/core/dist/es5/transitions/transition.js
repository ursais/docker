"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TRANSITION_STATE = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var TRANSITION_STATE = {
  NONE: 'none',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  ENDED: 'ended'
};
exports.TRANSITION_STATE = TRANSITION_STATE;

function noop() {}

var Transition = function () {
  function Transition(props) {
    (0, _classCallCheck2.default)(this, Transition);
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

  (0, _createClass2.default)(Transition, [{
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

exports.default = Transition;
//# sourceMappingURL=transition.js.map