"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@luma.gl/core");

var _effect = _interopRequireDefault(require("../../lib/effect"));

var _webMercatorViewport = _interopRequireDefault(require("../../viewports/web-mercator-viewport"));

var _reflectionEffectVertex = _interopRequireDefault(require("./reflection-effect-vertex.glsl"));

var _reflectionEffectFragment = _interopRequireDefault(require("./reflection-effect-fragment.glsl"));

var ReflectionEffect = function (_Effect) {
  (0, _inherits2.default)(ReflectionEffect, _Effect);

  function ReflectionEffect() {
    var _this;

    var reflectivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
    (0, _classCallCheck2.default)(this, ReflectionEffect);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ReflectionEffect).call(this));
    _this.reflectivity = reflectivity;
    _this.blur = blur;
    _this.framebuffer = null;

    _this.setNeedsRedraw();

    return _this;
  }

  (0, _createClass2.default)(ReflectionEffect, [{
    key: "getShaders",
    value: function getShaders() {
      return {
        vs: _reflectionEffectVertex.default,
        fs: _reflectionEffectFragment.default,
        modules: [],
        shaderCache: this.context.shaderCache
      };
    }
  }, {
    key: "initialize",
    value: function initialize(_ref) {
      var gl = _ref.gl,
          layerManager = _ref.layerManager;
      this.unitQuad = new _core.Model(gl, Object.assign({}, this.getShaders(), {
        id: 'reflection-effect',
        geometry: new _core.Geometry({
          drawMode: 6,
          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
        })
      }));
      this.framebuffer = new _core.Framebuffer(gl, {
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
      layerManager.setViewport(new _webMercatorViewport.default(Object.assign({}, viewport, {
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
}(_effect.default);

exports.default = ReflectionEffect;
//# sourceMappingURL=reflection-effect.js.map