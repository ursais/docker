import { Buffer } from '@luma.gl/core';
import { padArray } from '../utils/array-utils';
const ATTRIBUTE_MAPPING = {
  1: 'float',
  2: 'vec2',
  3: 'vec3',
  4: 'vec4'
};
export function getShaders(transitions) {
  const varyings = [];
  const attributeDeclarations = [];
  const uniformsDeclarations = [];
  const varyingDeclarations = [];
  const calculations = [];

  for (const attributeName in transitions) {
    const transition = transitions[attributeName];
    const attributeType = ATTRIBUTE_MAPPING[transition.attribute.size];

    if (attributeType) {
      transition.bufferIndex = varyings.length;
      varyings.push(attributeName);
      attributeDeclarations.push(`attribute ${attributeType} ${attributeName}From;`);
      attributeDeclarations.push(`attribute ${attributeType} ${attributeName}To;`);
      uniformsDeclarations.push(`uniform float ${attributeName}Time;`);
      varyingDeclarations.push(`varying ${attributeType} ${attributeName};`);
      calculations.push(`${attributeName} = mix(${attributeName}From, ${attributeName}To,
        ${attributeName}Time);`);
    }
  }

  const vs = `
#define SHADER_NAME feedback-vertex-shader
${attributeDeclarations.join('\n')}
${uniformsDeclarations.join('\n')}
${varyingDeclarations.join('\n')}

void main(void) {
  ${calculations.join('\n')}
  gl_Position = vec4(0.0);
}
`;
  const fs = `\
#define SHADER_NAME feedback-fragment-shader

precision highp float;

${varyingDeclarations.join('\n')}

void main(void) {
  gl_FragColor = vec4(0.0);
}
`;
  return {
    vs,
    fs,
    varyings
  };
}
export function getBuffers(transitions) {
  const sourceBuffers = {};
  const feedbackBuffers = {};

  for (const attributeName in transitions) {
    const _transitions$attribut = transitions[attributeName],
          fromState = _transitions$attribut.fromState,
          toState = _transitions$attribut.toState,
          buffer = _transitions$attribut.buffer;
    sourceBuffers[`${attributeName}From`] = fromState instanceof Buffer ? [fromState, {
      divisor: 0
    }] : fromState;
    sourceBuffers[`${attributeName}To`] = toState;
    feedbackBuffers[`${attributeName}`] = buffer;
  }

  return {
    sourceBuffers,
    feedbackBuffers
  };
}
export function padBuffer(_ref) {
  let fromState = _ref.fromState,
      toState = _ref.toState,
      fromLength = _ref.fromLength,
      toLength = _ref.toLength,
      fromBufferLayout = _ref.fromBufferLayout,
      toBufferLayout = _ref.toBufferLayout,
      _ref$getData = _ref.getData,
      getData = _ref$getData === void 0 ? x => x : _ref$getData;
  const hasBufferLayout = fromBufferLayout && toBufferLayout;

  if (!hasBufferLayout && fromLength >= toLength || !(fromState instanceof Buffer)) {
    return;
  }

  const data = new Float32Array(toLength);
  const fromData = fromState.getData({});
  const size = toState.size,
        constant = toState.constant;
  const toData = constant ? toState.getValue() : toState.getBuffer().getData({});
  const getMissingData = constant ? (i, chunk) => getData(toData, chunk) : (i, chunk) => getData(toData.subarray(i, i + size), chunk);
  padArray({
    source: fromData,
    target: data,
    sourceLayout: fromBufferLayout,
    targetLayout: toBufferLayout,
    size: toState.size,
    getData: getMissingData
  });
  fromState.setData({
    data
  });
}
//# sourceMappingURL=attribute-transition-utils.js.map