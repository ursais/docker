import Framebuffer from './framebuffer';
import Renderbuffer from './renderbuffer';
import Texture from './texture';
import { log } from '../utils';
const UNIFORM_SETTERS = {
  [5126]: (gl, location, value) => gl.uniform1fv(location, toFloatArray(value, 1)),
  [35664]: (gl, location, value) => gl.uniform2fv(location, toFloatArray(value, 2)),
  [35665]: (gl, location, value) => gl.uniform3fv(location, toFloatArray(value, 3)),
  [35666]: (gl, location, value) => gl.uniform4fv(location, toFloatArray(value, 4)),
  [5124]: (gl, location, value) => gl.uniform1iv(location, toIntArray(value, 1)),
  [35667]: (gl, location, value) => gl.uniform2iv(location, toIntArray(value, 2)),
  [35668]: (gl, location, value) => gl.uniform3iv(location, toIntArray(value, 3)),
  [35669]: (gl, location, value) => gl.uniform4iv(location, toIntArray(value, 4)),
  [35670]: (gl, location, value) => gl.uniform1iv(location, toIntArray(value, 1)),
  [35671]: (gl, location, value) => gl.uniform2iv(location, toIntArray(value, 2)),
  [35672]: (gl, location, value) => gl.uniform3iv(location, toIntArray(value, 3)),
  [35673]: (gl, location, value) => gl.uniform4iv(location, toIntArray(value, 4)),
  [35674]: (gl, location, value) => gl.uniformMatrix2fv(location, false, toFloatArray(value, 4)),
  [35675]: (gl, location, value) => gl.uniformMatrix3fv(location, false, toFloatArray(value, 9)),
  [35676]: (gl, location, value) => gl.uniformMatrix4fv(location, false, toFloatArray(value, 16)),
  [35678]: (gl, location, value) => gl.uniform1i(location, value),
  [35680]: (gl, location, value) => gl.uniform1i(location, value),
  [5125]: (gl, location, value) => gl.uniform1uiv(location, toUIntArray(value, 1)),
  [36294]: (gl, location, value) => gl.uniform2uiv(location, toUIntArray(value, 2)),
  [36295]: (gl, location, value) => gl.uniform3uiv(location, toUIntArray(value, 3)),
  [36296]: (gl, location, value) => gl.uniform4uiv(location, toUIntArray(value, 4)),
  [35685]: (gl, location, value) => gl.uniformMatrix2x3fv(location, false, toFloatArray(value, 6)),
  [35686]: (gl, location, value) => gl.uniformMatrix2x4fv(location, false, toFloatArray(value, 8)),
  [35687]: (gl, location, value) => gl.uniformMatrix3x2fv(location, false, toFloatArray(value, 6)),
  [35688]: (gl, location, value) => gl.uniformMatrix3x4fv(location, false, toFloatArray(value, 12)),
  [35689]: (gl, location, value) => gl.uniformMatrix4x2fv(location, false, toFloatArray(value, 8)),
  [35690]: (gl, location, value) => gl.uniformMatrix4x3fv(location, false, toFloatArray(value, 12)),
  [35679]: (gl, location, value) => gl.uniform1i(location, value),
  [35682]: (gl, location, value) => gl.uniform1i(location, value),
  [36289]: (gl, location, value) => gl.uniform1i(location, value),
  [36292]: (gl, location, value) => gl.uniform1i(location, value),
  [36293]: (gl, location, value) => gl.uniform1i(location, value),
  [36298]: (gl, location, value) => gl.uniform1i(location, value),
  [36299]: (gl, location, value) => gl.uniform1i(location, value),
  [36300]: (gl, location, value) => gl.uniform1i(location, value),
  [36303]: (gl, location, value) => gl.uniform1i(location, value),
  [36306]: (gl, location, value) => gl.uniform1i(location, value),
  [36307]: (gl, location, value) => gl.uniform1i(location, value),
  [36308]: (gl, location, value) => gl.uniform1i(location, value),
  [36311]: (gl, location, value) => gl.uniform1i(location, value)
};
const FLOAT_ARRAY = {};
const INT_ARRAY = {};
const UINT_ARRAY = {};
const array1 = [0];

function toTypedArray(value, uniformLength, Type, cache) {
  if (uniformLength === 1 && typeof value === 'boolean') {
    value = value ? 1 : 0;
  }

  if (Number.isFinite(value)) {
    array1[0] = value;
    value = array1;
  }

  const length = value.length;

  if (length % uniformLength) {
    log.warn("Uniform size should be multiples of ".concat(uniformLength), value)();
  }

  if (value instanceof Type) {
    return value;
  }

  let result = cache[length];

  if (!result) {
    result = new Type(length);
    cache[length] = result;
  }

  for (let i = 0; i < length; i++) {
    result[i] = value[i];
  }

  return result;
}

function toFloatArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Float32Array, FLOAT_ARRAY);
}

function toIntArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Int32Array, INT_ARRAY);
}

function toUIntArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Uint32Array, UINT_ARRAY);
}

export function parseUniformName(name) {
  if (name[name.length - 1] !== ']') {
    return {
      name,
      length: 1,
      isArray: false
    };
  }

  const UNIFORM_NAME_REGEXP = /([^[]*)(\[[0-9]+\])?/;
  const matches = name.match(UNIFORM_NAME_REGEXP);

  if (!matches || matches.length < 2) {
    throw new Error("Failed to parse GLSL uniform name ".concat(name));
  }

  return {
    name: matches[1],
    length: matches[2] || 1,
    isArray: Boolean(matches[2])
  };
}
export function getUniformSetter(gl, location, info) {
  const setter = UNIFORM_SETTERS[info.type];

  if (!setter) {
    throw new Error("Unknown GLSL uniform type ".concat(info.type));
  }

  return setter.bind(null, gl, location);
}
export function checkUniformValues(uniforms, source, uniformMap) {
  for (const uniformName in uniforms) {
    const value = uniforms[uniformName];
    const shouldCheck = !uniformMap || Boolean(uniformMap[uniformName]);

    if (shouldCheck && !checkUniformValue(value)) {
      source = source ? "".concat(source, " ") : '';
      console.error("".concat(source, " Bad uniform ").concat(uniformName), value);
      throw new Error("".concat(source, " Bad uniform ").concat(uniformName));
    }
  }

  return true;
}

function checkUniformValue(value) {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) {
    return checkUniformArray(value);
  }

  if (isFinite(value)) {
    return true;
  } else if (value === true || value === false) {
    return true;
  } else if (value instanceof Texture) {
    return true;
  } else if (value instanceof Renderbuffer) {
    return true;
  } else if (value instanceof Framebuffer) {
    return Boolean(value.texture);
  }

  return false;
}

function checkUniformArray(value) {
  if (value.length === 0) {
    return false;
  }

  const checkLength = Math.min(value.length, 16);

  for (let i = 0; i < checkLength; ++i) {
    if (!Number.isFinite(value[i])) {
      return false;
    }
  }

  return true;
}

export function areUniformsEqual(uniform1, uniform2) {
  if (Array.isArray(uniform1) || ArrayBuffer.isView(uniform1)) {
    if (!uniform2) {
      return false;
    }

    const len = uniform1.length;

    if (uniform2.length !== len) {
      return false;
    }

    for (let i = 0; i < len; i++) {
      if (uniform1[i] !== uniform2[i]) {
        return false;
      }
    }

    return true;
  }

  return uniform1 === uniform2;
}
export function getUniformCopy(uniform) {
  if (Array.isArray(uniform) || ArrayBuffer.isView(uniform)) {
    return uniform.slice();
  }

  return uniform;
}
//# sourceMappingURL=uniforms.js.map