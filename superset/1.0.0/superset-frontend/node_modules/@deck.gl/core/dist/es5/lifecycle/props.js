"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateProps = validateProps;
exports.diffProps = diffProps;
exports.compareProps = compareProps;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _assert = _interopRequireDefault(require("../utils/assert"));

function validateProps(props) {
  var propTypes = getPropTypes(props);

  for (var propName in propTypes) {
    var propType = propTypes[propName];
    var validate = propType.validate;

    if (validate && !validate(props[propName], propType)) {
      throw new Error("Invalid prop ".concat(propName, ": ").concat(props[propName]));
    }
  }
}

function diffProps(props, oldProps) {
  var propsChangedReason = compareProps({
    newProps: props,
    oldProps: oldProps,
    propTypes: getPropTypes(props),
    ignoreProps: {
      data: null,
      updateTriggers: null
    }
  });
  var dataChangedReason = diffDataProps(props, oldProps);
  var updateTriggersChangedReason = false;

  if (!dataChangedReason) {
    updateTriggersChangedReason = diffUpdateTriggers(props, oldProps);
  }

  return {
    dataChanged: dataChangedReason,
    propsChanged: propsChangedReason,
    updateTriggersChanged: updateTriggersChangedReason
  };
}

function compareProps() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      newProps = _ref.newProps,
      oldProps = _ref.oldProps,
      _ref$ignoreProps = _ref.ignoreProps,
      ignoreProps = _ref$ignoreProps === void 0 ? {} : _ref$ignoreProps,
      _ref$propTypes = _ref.propTypes,
      propTypes = _ref$propTypes === void 0 ? {} : _ref$propTypes,
      _ref$triggerName = _ref.triggerName,
      triggerName = _ref$triggerName === void 0 ? 'props' : _ref$triggerName;

  (0, _assert.default)(oldProps !== undefined && newProps !== undefined, 'compareProps args');

  if (oldProps === newProps) {
    return null;
  }

  if ((0, _typeof2.default)(newProps) !== 'object' || newProps === null) {
    return "".concat(triggerName, " changed shallowly");
  }

  if ((0, _typeof2.default)(oldProps) !== 'object' || oldProps === null) {
    return "".concat(triggerName, " changed shallowly");
  }

  for (var key in oldProps) {
    if (!(key in ignoreProps)) {
      if (!(key in newProps)) {
        return "".concat(triggerName, ".").concat(key, " dropped");
      }

      var newProp = newProps[key];
      var oldProp = oldProps[key];
      var propType = propTypes[key];
      var equal = propType && propType.equal;

      if (equal && !equal(newProp, oldProp, propType)) {
        return "".concat(triggerName, ".").concat(key, " changed deeply");
      }

      if (!equal) {
        equal = newProp && oldProp && newProp.equals;

        if (equal && !equal.call(newProp, oldProp)) {
          return "".concat(triggerName, ".").concat(key, " changed deeply");
        }
      }

      if (!equal && oldProp !== newProp) {
        return "".concat(triggerName, ".").concat(key, " changed shallowly");
      }
    }
  }

  for (var _key in newProps) {
    if (!(_key in ignoreProps)) {
      if (!(_key in oldProps)) {
        return "".concat(triggerName, ".").concat(_key, " added: undefined -> ").concat(newProps[_key]);
      }
    }
  }

  return null;
}

function diffDataProps(props, oldProps) {
  if (oldProps === null) {
    return 'oldProps is null, initial diff';
  }

  var dataComparator = props.dataComparator;

  if (dataComparator) {
    if (!dataComparator(props.data, oldProps.data)) {
      return 'Data comparator detected a change';
    }
  } else if (props.data !== oldProps.data) {
    return 'A new data container was supplied';
  }

  return null;
}

function diffUpdateTriggers(props, oldProps) {
  if (oldProps === null) {
    return 'oldProps is null, initial diff';
  }

  if ('all' in props.updateTriggers) {
    var diffReason = diffUpdateTrigger(props, oldProps, 'all');

    if (diffReason) {
      return {
        all: true
      };
    }
  }

  var triggerChanged = {};
  var reason = false;

  for (var triggerName in props.updateTriggers) {
    if (triggerName !== 'all') {
      var _diffReason = diffUpdateTrigger(props, oldProps, triggerName);

      if (_diffReason) {
        triggerChanged[triggerName] = true;
        reason = triggerChanged;
      }
    }
  }

  return reason;
}

function diffUpdateTrigger(props, oldProps, triggerName) {
  var newTriggers = props.updateTriggers[triggerName];
  newTriggers = newTriggers === undefined || newTriggers === null ? {} : newTriggers;
  var oldTriggers = oldProps.updateTriggers[triggerName];
  oldTriggers = oldTriggers === undefined || oldTriggers === null ? {} : oldTriggers;
  var diffReason = compareProps({
    oldProps: oldTriggers,
    newProps: newTriggers,
    triggerName: triggerName
  });
  return diffReason;
}

function getPropTypes(props) {
  var layer = props._component;
  var LayerType = layer && layer.constructor;
  return LayerType ? LayerType._propTypes : {};
}
//# sourceMappingURL=props.js.map