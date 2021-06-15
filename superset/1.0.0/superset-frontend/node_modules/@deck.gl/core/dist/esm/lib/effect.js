import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var Effect = function () {
  function Effect() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Effect);

    var _props$id = props.id,
        id = _props$id === void 0 ? 'effect' : _props$id;
    this.id = id;
    this.props = {};
    Object.assign(this.props, props);
  }

  _createClass(Effect, [{
    key: "prepare",
    value: function prepare() {}
  }, {
    key: "getParameters",
    value: function getParameters() {}
  }, {
    key: "cleanup",
    value: function cleanup() {}
  }]);

  return Effect;
}();

export { Effect as default };
//# sourceMappingURL=effect.js.map