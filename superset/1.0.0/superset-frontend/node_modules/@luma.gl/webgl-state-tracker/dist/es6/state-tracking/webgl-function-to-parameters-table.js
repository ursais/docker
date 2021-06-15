export default {
  enable: (update, capability) => update({
    [capability]: true
  }),
  disable: (update, capability) => update({
    [capability]: false
  }),
  pixelStorei: (update, pname, value) => update({
    [pname]: value
  }),
  hint: (update, pname, _hint) => update({
    [pname]: _hint
  }),
  bindFramebuffer: (update, target, framebuffer) => {
    switch (target) {
      case 36160:
        return update({
          [36006]: framebuffer,
          [36010]: framebuffer
        });

      case 36009:
        return update({
          [36006]: framebuffer
        });

      case 36008:
        return update({
          [36010]: framebuffer
        });

      default:
        return null;
    }
  },
  blendColor: (update, r, g, b, a) => update({
    [32773]: new Float32Array([r, g, b, a])
  }),
  blendEquation: (update, mode) => update({
    [32777]: mode,
    [34877]: mode
  }),
  blendEquationSeparate: (update, modeRGB, modeAlpha) => update({
    [32777]: modeRGB,
    [34877]: modeAlpha
  }),
  blendFunc: (update, src, dst) => update({
    [32969]: src,
    [32968]: dst,
    [32971]: src,
    [32970]: dst
  }),
  blendFuncSeparate: (update, srcRGB, dstRGB, srcAlpha, dstAlpha) => update({
    [32969]: srcRGB,
    [32968]: dstRGB,
    [32971]: srcAlpha,
    [32970]: dstAlpha
  }),
  clearColor: (update, r, g, b, a) => update({
    [3106]: new Float32Array([r, g, b, a])
  }),
  clearDepth: (update, depth) => update({
    [2931]: depth
  }),
  clearStencil: (update, s) => update({
    [2961]: s
  }),
  colorMask: (update, r, g, b, a) => update({
    [3107]: [r, g, b, a]
  }),
  cullFace: (update, mode) => update({
    [2885]: mode
  }),
  depthFunc: (update, func) => update({
    [2932]: func
  }),
  depthRange: (update, zNear, zFar) => update({
    [2928]: new Float32Array([zNear, zFar])
  }),
  depthMask: (update, mask) => update({
    [2930]: mask
  }),
  frontFace: (update, face) => update({
    [2886]: face
  }),
  lineWidth: (update, width) => update({
    [2849]: width
  }),
  polygonOffset: (update, factor, units) => update({
    [32824]: factor,
    [10752]: units
  }),
  sampleCoverage: (update, value, invert) => update({
    [32938]: value,
    [32939]: invert
  }),
  scissor: (update, x, y, width, height) => update({
    [3088]: new Int32Array([x, y, width, height])
  }),
  stencilMask: (update, mask) => update({
    [2968]: mask,
    [36005]: mask
  }),
  stencilMaskSeparate: (update, face, mask) => update({
    [face === 1028 ? 2968 : 36005]: mask
  }),
  stencilFunc: (update, func, ref, mask) => update({
    [2962]: func,
    [2967]: ref,
    [2963]: mask,
    [34816]: func,
    [36003]: ref,
    [36004]: mask
  }),
  stencilFuncSeparate: (update, face, func, ref, mask) => update({
    [face === 1028 ? 2962 : 34816]: func,
    [face === 1028 ? 2967 : 36003]: ref,
    [face === 1028 ? 2963 : 36004]: mask
  }),
  stencilOp: (update, fail, zfail, zpass) => update({
    [2964]: fail,
    [2965]: zfail,
    [2966]: zpass,
    [34817]: fail,
    [34818]: zfail,
    [34819]: zpass
  }),
  stencilOpSeparate: (update, face, fail, zfail, zpass) => update({
    [face === 1028 ? 2964 : 34817]: fail,
    [face === 1028 ? 2965 : 34818]: zfail,
    [face === 1028 ? 2966 : 34819]: zpass
  }),
  viewport: (update, x, y, width, height) => update({
    [2978]: new Int32Array([x, y, width, height])
  })
};
//# sourceMappingURL=webgl-function-to-parameters-table.js.map