import assert from '../utils/assert';
const cache = {};

function log(priority, arg) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  assert(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    args = formatArgs(arg, ...args);

    if (console.debug) {
      console.debug(...args);
    } else {
      console.info(...args);
    }
  }
}

function once(priority, arg) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (!cache[arg] && priority <= log.priority) {
    args = checkForAssertionErrors(args);
    console.error(...formatArgs(arg, ...args));
    cache[arg] = true;
  }
}

function warn(arg) {
  if (!cache[arg]) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    console.warn(`deck.gl: ${arg}`, ...args);
    cache[arg] = true;
  }
}

function error(arg) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  console.error(`deck.gl: ${arg}`, ...args);
}

function deprecated(oldUsage, newUsage) {
  log.warn(`\`${oldUsage}\` is deprecated and will be removed \
in a later version. Use \`${newUsage}\` instead`);
}

function removed(oldUsage, newUsage) {
  log.error(`\`${oldUsage}\` is no longer supported. Use \`${newUsage}\` instead,\
 check our upgrade-guide.md for more details`);
}

function time(priority, label) {
  assert(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    if (console.time) {
      console.time(label);
    } else {
      console.info(label);
    }
  }
}

function timeEnd(priority, label) {
  assert(Number.isFinite(priority), 'log priority must be a number');

  if (priority <= log.priority) {
    if (console.timeEnd) {
      console.timeEnd(label);
    } else {
      console.info(label);
    }
  }
}

function group(priority, arg) {
  let _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$collapsed = _ref.collapsed,
      collapsed = _ref$collapsed === void 0 ? false : _ref$collapsed;

  if (priority <= log.priority) {
    if (collapsed) {
      console.groupCollapsed(`luma.gl: ${arg}`);
    } else {
      console.group(`luma.gl: ${arg}`);
    }
  }
}

function groupEnd(priority, arg) {
  if (priority <= log.priority) {
    console.groupEnd(`luma.gl: ${arg}`);
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
    args.unshift(`deck.gl ${firstArg}`);
  } else {
    args.unshift(firstArg);
    args.unshift('deck.gl');
  }

  return args;
}

function checkForAssertionErrors(args) {
  const isAssertion = args && args.length > 0 && typeof args[0] === 'object' && args[0] !== null && args[0].name === 'AssertionError';

  if (isAssertion) {
    args = Array.prototype.slice.call(args);
    args.unshift(`assert(${args[0].message})`);
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
export default log;
//# sourceMappingURL=old-log.js.map