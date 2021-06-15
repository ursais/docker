import Pass from './pass.js';
export default class ClearMaskPass extends Pass {
  constructor(gl, props) {
    super(gl, Object.assign({
      id: 'clear-mask-pass'
    }, props));
  }

  render(gl) {
    gl.disable(2960);
  }

}
//# sourceMappingURL=clear-mask-pass.js.map