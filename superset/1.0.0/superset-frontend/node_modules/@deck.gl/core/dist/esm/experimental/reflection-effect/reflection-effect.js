import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Framebuffer, Model, Geometry } from '@luma.gl/core';
import Effect from '../../lib/effect';
import WebMercatorViewport from '../../viewports/web-mercator-viewport';
import reflectionVertex from './reflection-effect-vertex.glsl';
import reflectionFragment from './reflection-effect-fragment.glsl';

var ReflectionEffect = function (_Effect) {
  _inherits(ReflectionEffect, _Effect);

  function ReflectionEffect() {
    var _this;

    var reflectivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    _classCallCheck(this, ReflectionEffect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReflectionEffect).call(this));
    _this.reflectivity = reflectivity;
    _this.blur = blur;
    _this.framebuffer = null;

    _this.setNeedsRedraw();

    return _this;
  }

  _createClass(ReflectionEffect, [{
    key: "getShaders",
    value: function getShaders() {
      return {
        vs: reflectionVertex,
        fs: reflectionFragment,
        modules: [],
        shaderCache: this.context.shaderCache
      };
    }
  }, {
    key: "initialize",
    value: function initialize(_ref) {
      var gl = _ref.gl,
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
  }, {
    key: "preDraw",
    value: function preDraw(_ref2) {
      var gl = _ref2.gl,
          layerManager = _ref2.layerManager;
      var viewport = layerManager.context.viewport;
      var dpi = typeof window !== 'undefined' && window.devicePixelRatio || 1;
      this.framebuffer.resize({
        width: dpi * viewport.width,
        height: dpi * viewport.height
      });
      var pitch = viewport.pitch;
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
  }, {
    key: "draw",
    value: function draw(_ref3) {
      var gl = _ref3.gl,
          layerManager = _ref3.layerManager;
      this.unitQuad.render({
        reflectionTexture: this.framebuffer.texture,
        reflectionTextureWidth: this.framebuffer.width,
        reflectionTextureHeight: this.framebuffer.height,
        reflectivity: this.reflectivity,
        blur: this.blur
      });
    }
  }, {
    key: "finalize",
    value: function finalize(_ref4) {
      var gl = _ref4.gl,
          layerManager = _ref4.layerManager;
    }
  }]);

  return ReflectionEffect;
}(Effect);

export { ReflectionEffect as default };
//# sourceMappingURL=reflection-effect.js.map