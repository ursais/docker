"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _core = require("@luma.gl/core");

var _getPixelRatio = _interopRequireDefault(require("../utils/get-pixel-ratio"));

var _assert = _interopRequireDefault(require("../utils/assert"));

var _pickLayersPass = _interopRequireDefault(require("../passes/pick-layers-pass"));

var _queryObject = require("./picking/query-object");

var _pickInfo = require("./picking/pick-info");

var DeckPicker = function () {
  function DeckPicker(gl) {
    (0, _classCallCheck2.default)(this, DeckPicker);
    this.gl = gl;
    this.pickingFBO = null;
    this.pickLayersPass = new _pickLayersPass.default(gl);
    this.pixelRatio = null;
    this.layerFilter = null;
    this.pickingEvent = null;
    this.lastPickedInfo = {
      index: -1,
      layerId: null,
      info: null
    };
  }

  (0, _createClass2.default)(DeckPicker, [{
    key: "setProps",
    value: function setProps(props) {
      if ('useDevicePixels' in props) {
        this.pixelRatio = (0, _getPixelRatio.default)(props.useDevicePixels);
      }

      if ('layerFilter' in props) {
        this.layerFilter = props.layerFilter;
      }

      this.pickLayersPass.setProps({
        pixelRatio: this.pixelRatio,
        layerFilter: this.layerFilter
      });
    }
  }, {
    key: "pickObject",
    value: function pickObject(_ref) {
      var x = _ref.x,
          y = _ref.y,
          mode = _ref.mode,
          _ref$radius = _ref.radius,
          radius = _ref$radius === void 0 ? 0 : _ref$radius,
          layers = _ref.layers,
          viewports = _ref.viewports,
          activateViewport = _ref.activateViewport,
          _ref$depth = _ref.depth,
          depth = _ref$depth === void 0 ? 1 : _ref$depth,
          _ref$event = _ref.event,
          event = _ref$event === void 0 ? null : _ref$event;
      this.pickingEvent = event;
      var result = this.pickClosestObject({
        x: x,
        y: y,
        radius: radius,
        layers: layers,
        mode: mode,
        depth: depth,
        viewports: viewports,
        onViewportActive: activateViewport
      });
      this.pickingEvent = null;
      return result;
    }
  }, {
    key: "pickObjects",
    value: function pickObjects(_ref2) {
      var x = _ref2.x,
          y = _ref2.y,
          width = _ref2.width,
          height = _ref2.height,
          layers = _ref2.layers,
          viewports = _ref2.viewports,
          activateViewport = _ref2.activateViewport;
      return this.pickVisibleObjects({
        x: x,
        y: y,
        width: width,
        height: height,
        layers: layers,
        mode: 'pickObjects',
        viewports: viewports,
        onViewportActive: activateViewport
      });
    }
  }, {
    key: "getLastPickedObject",
    value: function getLastPickedObject(_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          layers = _ref3.layers,
          viewports = _ref3.viewports;
      var lastPickedInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lastPickedInfo.info;
      var lastPickedLayerId = lastPickedInfo && lastPickedInfo.layer && lastPickedInfo.layer.id;
      var layer = lastPickedLayerId ? layers.find(function (l) {
        return l.id === lastPickedLayerId;
      }) : null;
      var coordinate = viewports[0] && viewports[0].unproject([x, y]);
      var info = {
        x: x,
        y: y,
        coordinate: coordinate,
        lngLat: coordinate,
        layer: layer
      };

      if (layer) {
        return Object.assign({}, lastPickedInfo, info);
      }

      return Object.assign(info, {
        color: null,
        object: null,
        index: -1
      });
    }
  }, {
    key: "updatePickingBuffer",
    value: function updatePickingBuffer() {
      var gl = this.gl;

      if (!this.pickingFBO) {
        this.pickingFBO = new _core.Framebuffer(gl);
      }

      this.pickingFBO.resize({
        width: gl.canvas.width,
        height: gl.canvas.height
      });
      return this.pickingFBO;
    }
  }, {
    key: "pickClosestObject",
    value: function pickClosestObject(_ref4) {
      var layers = _ref4.layers,
          viewports = _ref4.viewports,
          x = _ref4.x,
          y = _ref4.y,
          radius = _ref4.radius,
          _ref4$depth = _ref4.depth,
          depth = _ref4$depth === void 0 ? 1 : _ref4$depth,
          mode = _ref4.mode,
          onViewportActive = _ref4.onViewportActive;
      this.updatePickingBuffer();
      var pixelRatio = this.pixelRatio;
      var deviceX = Math.round(x * pixelRatio);
      var deviceY = Math.round(this.gl.canvas.height - y * pixelRatio);
      var deviceRadius = Math.round(radius * pixelRatio);
      var _this$pickingFBO = this.pickingFBO,
          width = _this$pickingFBO.width,
          height = _this$pickingFBO.height;
      var deviceRect = this.getPickingRect({
        deviceX: deviceX,
        deviceY: deviceY,
        deviceRadius: deviceRadius,
        deviceWidth: width,
        deviceHeight: height
      });
      var infos;
      var result = [];
      var affectedLayers = {};

      for (var i = 0; i < depth; i++) {
        var pickedColors = deviceRect && this.drawAndSamplePickingBuffer({
          layers: layers,
          viewports: viewports,
          onViewportActive: onViewportActive,
          deviceRect: deviceRect,
          redrawReason: mode
        });
        var pickInfo = (0, _queryObject.getClosestObject)({
          pickedColors: pickedColors,
          layers: layers,
          deviceX: deviceX,
          deviceY: deviceY,
          deviceRadius: deviceRadius,
          deviceRect: deviceRect
        });

        if (pickInfo.pickedColor && i + 1 < depth) {
          var layerId = pickInfo.pickedColor[3] - 1;

          if (!affectedLayers[layerId]) {
            affectedLayers[layerId] = layers[layerId].copyPickingColors();
          }

          layers[layerId].clearPickingColor(pickInfo.pickedColor);
        }

        infos = (0, _pickInfo.processPickInfo)({
          pickInfo: pickInfo,
          lastPickedInfo: this.lastPickedInfo,
          mode: mode,
          layers: layers,
          viewports: viewports,
          x: x,
          y: y,
          deviceX: deviceX,
          deviceY: deviceY,
          pixelRatio: pixelRatio
        });
        var processedPickInfos = this.callLayerPickingCallbacks(infos, mode);

        if (processedPickInfos) {
          processedPickInfos.forEach(function (info) {
            return result.push(info);
          });
        }

        if (!pickInfo.pickedColor) {
          break;
        }
      }

      Object.keys(affectedLayers).forEach(function (layerId) {
        return layers[layerId].restorePickingColors(affectedLayers[layerId]);
      });
      return {
        result: result,
        emptyInfo: infos && infos.get(null)
      };
    }
  }, {
    key: "pickVisibleObjects",
    value: function pickVisibleObjects(_ref5) {
      var layers = _ref5.layers,
          viewports = _ref5.viewports,
          x = _ref5.x,
          y = _ref5.y,
          width = _ref5.width,
          height = _ref5.height,
          mode = _ref5.mode,
          onViewportActive = _ref5.onViewportActive;
      this.updatePickingBuffer();
      var pixelRatio = this.pixelRatio;
      var deviceLeft = Math.round(x * pixelRatio);
      var deviceBottom = Math.round(this.gl.canvas.height - y * pixelRatio);
      var deviceRight = Math.round((x + width) * pixelRatio);
      var deviceTop = Math.round(this.gl.canvas.height - (y + height) * pixelRatio);
      var deviceRect = {
        x: deviceLeft,
        y: deviceTop,
        width: deviceRight - deviceLeft,
        height: deviceBottom - deviceTop
      };
      var pickedColors = this.drawAndSamplePickingBuffer({
        layers: layers,
        viewports: viewports,
        onViewportActive: onViewportActive,
        deviceRect: deviceRect,
        redrawReason: mode
      });
      var pickInfos = (0, _queryObject.getUniqueObjects)({
        pickedColors: pickedColors,
        layers: layers
      });
      var uniqueInfos = new Map();
      pickInfos.forEach(function (pickInfo) {
        var info = {
          color: pickInfo.pickedColor,
          layer: null,
          index: pickInfo.pickedObjectIndex,
          picked: true,
          x: x,
          y: y,
          width: width,
          height: height,
          pixelRatio: pixelRatio
        };
        info = (0, _pickInfo.getLayerPickingInfo)({
          layer: pickInfo.pickedLayer,
          info: info,
          mode: mode
        });

        if (!uniqueInfos.has(info.object)) {
          uniqueInfos.set(info.object, info);
        }
      });
      return Array.from(uniqueInfos.values());
    }
  }, {
    key: "drawAndSamplePickingBuffer",
    value: function drawAndSamplePickingBuffer(_ref6) {
      var layers = _ref6.layers,
          viewports = _ref6.viewports,
          onViewportActive = _ref6.onViewportActive,
          deviceRect = _ref6.deviceRect,
          redrawReason = _ref6.redrawReason;
      (0, _assert.default)(deviceRect);
      (0, _assert.default)(Number.isFinite(deviceRect.width) && deviceRect.width > 0, '`width` must be > 0');
      (0, _assert.default)(Number.isFinite(deviceRect.height) && deviceRect.height > 0, '`height` must be > 0');
      var pickableLayers = layers.filter(function (layer) {
        return layer.isPickable();
      });

      if (pickableLayers.length < 1) {
        return null;
      }

      var pickingFBO = this.pickingFBO;
      var effectProps = {
        lightSources: {}
      };
      this.pickLayersPass.render({
        layers: layers,
        viewports: viewports,
        onViewportActive: onViewportActive,
        pickingFBO: pickingFBO,
        deviceRect: deviceRect,
        redrawReason: redrawReason,
        effectProps: effectProps
      });
      var x = deviceRect.x,
          y = deviceRect.y,
          width = deviceRect.width,
          height = deviceRect.height;
      var pickedColors = new Uint8Array(width * height * 4);
      (0, _core.readPixelsToArray)(pickingFBO, {
        sourceX: x,
        sourceY: y,
        sourceWidth: width,
        sourceHeight: height,
        target: pickedColors
      });
      return pickedColors;
    }
  }, {
    key: "getPickingRect",
    value: function getPickingRect(_ref7) {
      var deviceX = _ref7.deviceX,
          deviceY = _ref7.deviceY,
          deviceRadius = _ref7.deviceRadius,
          deviceWidth = _ref7.deviceWidth,
          deviceHeight = _ref7.deviceHeight;
      var valid = deviceX >= 0 && deviceY >= 0 && deviceX < deviceWidth && deviceY < deviceHeight;

      if (!valid) {
        return null;
      }

      var x = Math.max(0, deviceX - deviceRadius);
      var y = Math.max(0, deviceY - deviceRadius);
      var width = Math.min(deviceWidth, deviceX + deviceRadius) - x + 1;
      var height = Math.min(deviceHeight, deviceY + deviceRadius) - y + 1;
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  }, {
    key: "callLayerPickingCallbacks",
    value: function callLayerPickingCallbacks(infos, mode) {
      var unhandledPickInfos = [];
      var pickingEvent = this.pickingEvent;
      infos.forEach(function (info) {
        if (!info.layer) {
          return;
        }

        var handled = false;

        switch (mode) {
          case 'hover':
            handled = info.layer.onHover(info, pickingEvent);
            break;

          case 'query':
            break;

          default:
            throw new Error('unknown pick type');
        }

        if (!handled) {
          unhandledPickInfos.push(info);
        }
      });
      return unhandledPickInfos;
    }
  }]);
  return DeckPicker;
}();

exports.default = DeckPicker;
//# sourceMappingURL=deck-picker.js.map