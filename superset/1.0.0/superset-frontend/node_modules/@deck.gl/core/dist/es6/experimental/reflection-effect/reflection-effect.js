import { Framebuffer, Model, Geometry } from '@luma.gl/core';
import Effect from '../../lib/effect';
import WebMercatorViewport from '../../viewports/web-mercator-viewport';
import reflectionVertex from './reflection-effect-vertex.glsl';
import reflectionFragment from './reflection-effect-fragment.glsl';
export default class ReflectionEffect extends Effect {
  constructor() {
    let reflectivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    let blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
    super();
    this.reflectivity = reflectivity;
    this.blur = blur;
    this.framebuffer = null;
    this.setNeedsRedraw();
  }

  getShaders() {
    return {
      vs: reflectionVertex,
      fs: reflectionFragment,
      modules: [],
      shaderCache: this.context.shaderCache
    };
  }

  initialize(_ref) {
    let gl = _ref.gl,
        layerManager = _ref.layerManager;
    this.unitQuad = new Model(gl, Object.assign({}, this.getShaders(), {
      id: 'reflection-effect',
      geometry: new Geometry({
        drawMode: 6,
        vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
      })
    }));
    this.framebuffer = new Framebuffer(gl, {
      depth: true
    });
  }

  preDraw(_ref2) {
    let gl = _ref2.gl,
        layerManager = _ref2.layerManager;
    const viewport = layerManager.context.viewport;
    const dpi = typeof window !== 'undefined' && window.devicePixelRatio || 1;
    this.framebuffer.resize({
      width: dpi * viewport.width,
      height: dpi * viewport.height
    });
    const pitch = viewport.pitch;
    this.framebuffer.bind();
    layerManager.setViewport(new WebMercatorViewport(Object.assign({}, viewport, {
      pitch: -180 - pitch
    })));
    gl.clear(16384 | 256);
    layerManager.drawLayers({
      pass: 'reflection'
    });
    layerManager.setViewport(viewport);
    this.framebuffer.unbind();
  }

  draw(_ref3) {
    let gl = _ref3.gl,
        layerManager = _ref3.layerManager;
    this.unitQuad.render({
      reflectionTexture: this.framebuffer.texture,
      reflectionTextureWidth: this.framebuffer.width,
      reflectionTextureHeight: this.framebuffer.height,
      reflectivity: this.reflectivity,
      blur: this.blur
    });
  }

  finalize(_ref4) {
    let gl = _ref4.gl,
        layerManager = _ref4.layerManager;
  }

}
//# sourceMappingURL=reflection-effect.js.map