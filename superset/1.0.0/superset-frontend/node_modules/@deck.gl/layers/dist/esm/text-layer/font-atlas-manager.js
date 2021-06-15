import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Texture2D } from '@luma.gl/core';
import TinySDF from '@mapbox/tiny-sdf';
import { buildMapping } from './font-atlas-utils';
import LRUCache from './lru-cache';

function getDefaultCharacterSet() {
  var charSet = [];

  for (var i = 32; i < 128; i++) {
    charSet.push(String.fromCharCode(i));
  }

  return charSet;
}

export var DEFAULT_CHAR_SET = getDefaultCharacterSet();
export var DEFAULT_FONT_FAMILY = 'Monaco, monospace';
export var DEFAULT_FONT_WEIGHT = 'normal';
export var DEFAULT_FONT_SIZE = 64;
export var DEFAULT_BUFFER = 2;
export var DEFAULT_CUTOFF = 0.25;
export var DEFAULT_RADIUS = 3;
var GL_TEXTURE_WRAP_S = 0x2802;
var GL_TEXTURE_WRAP_T = 0x2803;
var GL_CLAMP_TO_EDGE = 0x812f;
var MAX_CANVAS_WIDTH = 1024;
var BASELINE_SCALE = 0.9;
var HEIGHT_SCALE = 1.2;
var CACHE_LIMIT = 3;
var cache = new LRUCache(CACHE_LIMIT);
var VALID_PROPS = ['fontFamily', 'fontWeight', 'characterSet', 'fontSize', 'sdf', 'buffer', 'cutoff', 'radius'];

function getNewChars(key, characterSet) {
  var cachedFontAtlas = cache.get(key);

  if (!cachedFontAtlas) {
    return characterSet;
  }

  var newChars = [];
  var cachedMapping = cachedFontAtlas.mapping;
  var cachedCharSet = Object.keys(cachedMapping);
  cachedCharSet = new Set(cachedCharSet);
  var charSet = characterSet;

  if (charSet instanceof Array) {
    charSet = new Set(charSet);
  }

  charSet.forEach(function (char) {
    if (!cachedCharSet.has(char)) {
      newChars.push(char);
    }
  });
  return newChars;
}

function populateAlphaChannel(alphaChannel, imageData) {
  for (var i = 0; i < alphaChannel.length; i++) {
    imageData.data[4 * i + 3] = alphaChannel[i];
  }
}

function setTextStyle(ctx, fontFamily, fontSize, fontWeight) {
  ctx.font = "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'baseline';
  ctx.textAlign = 'left';
}

var FontAtlasManager = function () {
  function FontAtlasManager(gl) {
    _classCallCheck(this, FontAtlasManager);

    this.gl = gl;
    this.props = {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: DEFAULT_FONT_WEIGHT,
      characterSet: DEFAULT_CHAR_SET,
      fontSize: DEFAULT_FONT_SIZE,
      buffer: DEFAULT_BUFFER,
      sdf: false,
      cutoff: DEFAULT_CUTOFF,
      radius: DEFAULT_RADIUS
    };
    this._key = null;
    this._texture = new Texture2D(this.gl);
  }

  _createClass(FontAtlasManager, [{
    key: "finalize",
    value: function finalize() {
      this._texture.delete();
    }
  }, {
    key: "setProps",
    value: function setProps() {
      var _this = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      VALID_PROPS.forEach(function (prop) {
        if (prop in props) {
          _this.props[prop] = props[prop];
        }
      });
      var oldKey = this._key;
      this._key = this._getKey();
      var charSet = getNewChars(this._key, this.props.characterSet);
      var cachedFontAtlas = cache.get(this._key);

      if (cachedFontAtlas && charSet.length === 0) {
        if (this._key !== oldKey) {
          this._updateTexture(cachedFontAtlas);
        }

        return;
      }

      var fontAtlas = this._generateFontAtlas(this._key, charSet, cachedFontAtlas);

      this._updateTexture(fontAtlas);

      cache.set(this._key, fontAtlas);
    }
  }, {
    key: "_updateTexture",
    value: function _updateTexture(_ref) {
      var _parameters;

      var canvas = _ref.data,
          width = _ref.width,
          height = _ref.height;

      if (this._texture.width !== width || this._texture.height !== height) {
        this._texture.resize({
          width: width,
          height: height
        });
      }

      this._texture.setImageData({
        data: canvas,
        width: width,
        height: height,
        parameters: (_parameters = {}, _defineProperty(_parameters, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE), _defineProperty(_parameters, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE), _defineProperty(_parameters, 37440, true), _parameters)
      });

      this._texture.generateMipmap();
    }
  }, {
    key: "_generateFontAtlas",
    value: function _generateFontAtlas(key, characterSet, cachedFontAtlas) {
      var _this$props = this.props,
          fontFamily = _this$props.fontFamily,
          fontWeight = _this$props.fontWeight,
          fontSize = _this$props.fontSize,
          buffer = _this$props.buffer,
          sdf = _this$props.sdf,
          radius = _this$props.radius,
          cutoff = _this$props.cutoff;
      var canvas = cachedFontAtlas && cachedFontAtlas.data;

      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = MAX_CANVAS_WIDTH;
      }

      var ctx = canvas.getContext('2d');
      setTextStyle(ctx, fontFamily, fontSize, fontWeight);

      var _buildMapping = buildMapping(Object.assign({
        getFontWidth: function getFontWidth(char) {
          return ctx.measureText(char).width;
        },
        fontHeight: fontSize * HEIGHT_SCALE,
        buffer: buffer,
        characterSet: characterSet,
        maxCanvasWidth: MAX_CANVAS_WIDTH
      }, cachedFontAtlas && {
        mapping: cachedFontAtlas.mapping,
        xOffset: cachedFontAtlas.xOffset,
        yOffset: cachedFontAtlas.yOffset
      })),
          mapping = _buildMapping.mapping,
          canvasHeight = _buildMapping.canvasHeight,
          xOffset = _buildMapping.xOffset,
          yOffset = _buildMapping.yOffset;

      if (canvas.height !== canvasHeight) {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.height = canvasHeight;
        ctx.putImageData(imageData, 0, 0);
      }

      setTextStyle(ctx, fontFamily, fontSize, fontWeight);

      if (sdf) {
        var tinySDF = new TinySDF(fontSize, buffer, radius, cutoff, fontFamily, fontWeight);

        var _imageData = ctx.getImageData(0, 0, tinySDF.size, tinySDF.size);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = characterSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var char = _step.value;
            populateAlphaChannel(tinySDF.draw(char), _imageData);
            ctx.putImageData(_imageData, mapping[char].x - buffer, mapping[char].y - buffer);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = characterSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _char = _step2.value;
            ctx.fillText(_char, mapping[_char].x, mapping[_char].y + fontSize * BASELINE_SCALE);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return {
        xOffset: xOffset,
        yOffset: yOffset,
        mapping: mapping,
        data: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }
  }, {
    key: "_getKey",
    value: function _getKey() {
      var _this$props2 = this.props,
          gl = _this$props2.gl,
          fontFamily = _this$props2.fontFamily,
          fontWeight = _this$props2.fontWeight,
          fontSize = _this$props2.fontSize,
          buffer = _this$props2.buffer,
          sdf = _this$props2.sdf,
          radius = _this$props2.radius,
          cutoff = _this$props2.cutoff;

      if (sdf) {
        return "".concat(gl, " ").concat(fontFamily, " ").concat(fontWeight, " ").concat(fontSize, " ").concat(buffer, " ").concat(radius, " ").concat(cutoff);
      }

      return "".concat(gl, " ").concat(fontFamily, " ").concat(fontWeight, " ").concat(fontSize, " ").concat(buffer);
    }
  }, {
    key: "texture",
    get: function get() {
      return this._texture;
    }
  }, {
    key: "mapping",
    get: function get() {
      var data = cache.get(this._key);
      return data && data.mapping;
    }
  }, {
    key: "scale",
    get: function get() {
      return HEIGHT_SCALE;
    }
  }]);

  return FontAtlasManager;
}();

export { FontAtlasManager as default };
//# sourceMappingURL=font-atlas-manager.js.map