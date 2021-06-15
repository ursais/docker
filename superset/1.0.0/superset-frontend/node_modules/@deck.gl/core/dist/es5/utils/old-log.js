"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _assert = _interopRequireDefault(require("../utils/assert"));

var cache = {};

function log(priority, arg) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (0, _assert.default)(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    args = formatArgs.apply(void 0, [arg].concat((0, _toConsumableArray2.default)(args)));

    if (console.debug) {
      var _console;

      (_console = console).debug.apply(_console, (0, _toConsumableArray2.default)(args));
    } else {
      var _console2;

      (_console2 = console).info.apply(_console2, (0, _toConsumableArray2.default)(args));
    }
  }
}

function once(priority, arg) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (!cache[arg] && priority <= log.priority) {
    var _console3;

    args = checkForAssertionErrors(args);

    (_console3 = console).error.apply(_console3, (0, _toConsumableArray2.default)(formatArgs.apply(void 0, [arg].concat((0, _toConsumableArray2.default)(args)))));

    cache[arg] = true;
  }
}

function warn(arg) {
  if (!cache[arg]) {
    var _console4;

    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    (_console4 = console).warn.apply(_console4, ["deck.gl: ".concat(arg)].concat(args));

    cache[arg] = true;
  }
}

function error(arg) {
  var _console5;

  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  (_console5 = console).error.apply(_console5, ["deck.gl: ".concat(arg)].concat(args));
}

function deprecated(oldUsage, newUsage) {
  log.warn("`".concat(oldUsage, "` is deprecated and will be removed in a later version. Use `").concat(newUsage, "` instead"));
}

function removed(oldUsage, newUsage) {
  log.error("`".concat(oldUsage, "` is no longer supported. Use `").concat(newUsage, "` instead, check our upgrade-guide.md for more details"));
}

function time(priority, label) {
  (0, _assert.default)(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    if (console.time) {
      console.time(label);
    } else {
      console.info(label);
    }
  }
}

function timeEnd(priority, label) {
  (0, _assert.default)(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    if (console.timeEnd) {
      console.timeEnd(label);
    } else {
      console.info(label);
    }
  }
}

function group(priority, arg) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$collapsed = _ref.collapsed,
      collapsed = _ref$collapsed === void 0 ? false : _ref$collapsed;

  if (priority <= log.priority) {
    if (collapsed) {
      console.groupCollapsed("luma.gl: ".concat(arg));
    } else {
      console.group("luma.gl: ".concat(arg));
    }
  }
}

function groupEnd(priority, arg) {
  if (priority <= log.priority) {
    console.groupEnd("luma.gl: ".concat(arg));
  }
}

function formatArgs(firstArg) {
  if (typeof firstArg === 'function') {
    firstArg = firstArg();
  }

  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if (typeof firstArg === 'string') {
    args.unshift("deck.gl ".concat(firstArg));
  } else {
    args.unshift(firstArg);
    args.unshift('deck.gl');
  }

  return args;
}

function checkForAssertionErrors(args) {
  var isAssertion = args && args.length > 0 && (0, _typeof2.default)(args[0]) === 'object' && args[0] !== null && args[0].name === 'AssertionError';

  if (isAssertion) {
    args = Array.prototype.slice.call(args);
    args.unshift("assert(".concat(args[0].message, ")"));
  }

  return args;
}

log.priority = 0;
log.log = log;
log.once = once;
log.time = time;
log.timeEnd = timeEnd;
log.warn = warn;
log.error = error;
log.deprecated = deprecated;
log.removed = removed;
log.group = group;
log.groupEnd = groupEnd;
var _default = log;
exports.default = _default;
//# sourceMappingURL=old-log.js.map