import { ClipSpace, withParameters, clear } from '@luma.gl/core';
import Pass from './pass';
export default class ScreenPass extends Pass {
  constructor(gl) {
    let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(gl, props);
    const module = props.module,
          fs = props.fs,
          id = props.id,
          moduleProps = props.moduleProps;
    this.model = this._getModel(gl, module, fs, id, moduleProps);
  }

  render(params) {
    const gl = this.gl;
    withParameters(gl, {
      framebuffer: params.outputBuffer,
      clearColor: [0, 0, 0, 0]
    }, () => this._renderPass(gl, params));
  }

  delete() {
    this.model.delete();
    this.model = null;
  }

  _getModel(gl, module, fs, id, userProps) {
    const model = new ClipSpace(gl, {
      id,
      fs,
      modules: [module]
    });
    const uniforms = Object.assign(module.getUniforms(), module.getUniforms(userProps));
    model.setUniforms(uniforms);
    return model;
  }

  _renderPass(gl, _ref) {
    let inputBuffer = _ref.inputBuffer,
        outputBuffer = _ref.outputBuffer;
    clear(gl, {
      color: true
    });
    this.model.draw({
      uniforms: {
        texture: inputBuffer,
        texSize: [inputBuffer.width, inputBuffer.height]
      },
      parameters: {
        depthWrite: false,
        depthTest: false
      }
    });
  }

}
//# sourceMappingURL=screen-pass.js.map