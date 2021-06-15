"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShaders = getShaders;
exports.getBuffers = getBuffers;
exports.padBuffer = padBuffer;

var _core = require("@luma.gl/core");

var _arrayUtils = require("../utils/array-utils");

var ATTRIBUTE_MAPPING = {
  1: 'float',
  2: 'vec2',
  3: 'vec3',
  4: 'vec4'
};

function getShaders(transitions) {
  var varyings = [];
  var attributeDeclarations = [];
  var uniformsDeclarations = [];
  var varyingDeclarations = [];
  var calculations = [];

  for (var attributeName in transitions) {
    var transition = transitions[attributeName];
    var attributeType = ATTRIBUTE_MAPPING[transition.attribute.size];

    if (attributeType) {
      transition.bufferIndex = varyings.length;
      varyings.push(attributeName);
      attributeDeclarations.push("attribute ".concat(attributeType, " ").concat(attributeName, "From;"));
      attributeDeclarations.push("attribute ".concat(attributeType, " ").concat(attributeName, "To;"));
      uniformsDeclarations.push("uniform float ".concat(attributeName, "Time;"));
      varyingDeclarations.push("varying ".concat(attributeType, " ").concat(attributeName, ";"));
      calculations.push("".concat(attributeName, " = mix(").concat(attributeName, "From, ").concat(attributeName, "To,\n        ").concat(attributeName, "Time);"));
    }
  }

  var vs = "\n#define SHADER_NAME feedback-vertex-shader\n".concat(attributeDeclarations.join('\n'), "\n").concat(uniformsDeclarations.join('\n'), "\n").concat(varyingDeclarations.join('\n'), "\n\nvoid main(void) {\n  ").concat(calculations.join('\n'), "\n  gl_Position = vec4(0.0);\n}\n");
  var fs = "#define SHADER_NAME feedback-fragment-shader\n\nprecision highp float;\n\n".concat(varyingDeclarations.join('\n'), "\n\nvoid main(void) {\n  gl_FragColor = vec4(0.0);\n}\n");
  return {
    vs: vs,
    fs: fs,
    varyings: varyings
  };
}

function getBuffers(transitions) {
  var sourceBuffers = {};
  var feedbackBuffers = {};

  for (var attributeName in transitions) {
    var _transitions$attribut = transitions[attributeName],
        fromState = _transitions$attribut.fromState,
        toState = _transitions$attribut.toState,
        buffer = _transitions$attribut.buffer;
    sourceBuffers["".concat(attributeName, "From")] = fromState instanceof _core.Buffer ? [fromState, {
      divisor: 0
    }] : fromState;
    sourceBuffers["".concat(attributeName, "To")] = toState;
    feedbackBuffers["".concat(attributeName)] = buffer;
  }

  return {
    sourceBuffers: sourceBuffers,
    feedbackBuffers: feedbackBuffers
  };
}

function padBuffer(_ref) {
  var fromState = _ref.fromState,
      toState = _ref.toState,
      fromLength = _ref.fromLength,
      toLength = _ref.toLength,
      fromBufferLayout = _ref.fromBufferLayout,
      toBufferLayout = _ref.toBufferLayout,
      _ref$getData = _ref.getData,
      getData = _ref$getData === void 0 ? function (x) {
    return x;
  } : _ref$getData;
  var hasBufferLayout = fromBufferLayout && toBufferLayout;

  if (!hasBufferLayout && fromLength >= toLength || !(fromState instanceof _core.Buffer)) {
    return;
  }

  var data = new Float32Array(toLength);
  var fromData = fromState.getData({});
  var size = toState.size,
      constant = toState.constant;
  var toData = constant ? toState.getValue() : toState.getBuffer().getData({});
  var getMissingData = constant ? function (i, chunk) {
    return getData(toData, chunk);
  } : function (i, chunk) {
    return getData(toData.subarray(i, i + size), chunk);
  };
  (0, _arrayUtils.padArray)({
    source: fromData,
    target: data,
    sourceLayout: fromBufferLayout,
    targetLayout: toBufferLayout,
    size: toState.size,
    getData: getMissingData
  });
  fromState.setData({
    data: data
  });
}
//# sourceMappingURL=attribute-transition-utils.js.map