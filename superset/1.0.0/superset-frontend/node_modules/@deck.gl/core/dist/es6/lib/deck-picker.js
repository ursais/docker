import { Framebuffer, readPixelsToArray } from '@luma.gl/core';
import getPixelRatio from '../utils/get-pixel-ratio';
import assert from '../utils/assert';
import PickLayersPass from '../passes/pick-layers-pass';
import { getClosestObject, getUniqueObjects } from './picking/query-object';
import { processPickInfo, getLayerPickingInfo } from './picking/pick-info';
export default class DeckPicker {
  constructor(gl) {
    this.gl = gl;
    this.pickingFBO = null;
    this.pickLayersPass = new PickLayersPass(gl);
    this.pixelRatio = null;
    this.layerFilter = null;
    this.pickingEvent = null;
    this.lastPickedInfo = {
      index: -1,
      layerId: null,
      info: null
    };
  }

  setProps(props) {
    if ('useDevicePixels' in props) {
      this.pixelRatio = getPixelRatio(props.useDevicePixels);
    }

    if ('layerFilter' in props) {
      this.layerFilter = props.layerFilter;
    }

    this.pickLayersPass.setProps({
      pixelRatio: this.pixelRatio,
      layerFilter: this.layerFilter
    });
  }

  pickObject(_ref) {
    let x = _ref.x,
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
    const result = this.pickClosestObject({
      x,
      y,
      radius,
      layers,
      mode,
      depth,
      viewports,
      onViewportActive: activateViewport
    });
    this.pickingEvent = null;
    return result;
  }

  pickObjects(_ref2) {
    let x = _ref2.x,
        y = _ref2.y,
        width = _ref2.width,
        height = _ref2.height,
        layers = _ref2.layers,
        viewports = _ref2.viewports,
        activateViewport = _ref2.activateViewport;
    return this.pickVisibleObjects({
      x,
      y,
      width,
      height,
      layers,
      mode: 'pickObjects',
      viewports,
      onViewportActive: activateViewport
    });
  }

  getLastPickedObject(_ref3) {
    let x = _ref3.x,
        y = _ref3.y,
        layers = _ref3.layers,
        viewports = _ref3.viewports;
    let lastPickedInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.lastPickedInfo.info;
    const lastPickedLayerId = lastPickedInfo && lastPickedInfo.layer && lastPickedInfo.layer.id;
    const layer = lastPickedLayerId ? layers.find(l => l.id === lastPickedLayerId) : null;
    const coordinate = viewports[0] && viewports[0].unproject([x, y]);
    const info = {
      x,
      y,
      coordinate,
      lngLat: coordinate,
      layer
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

  updatePickingBuffer() {
    const gl = this.gl;

    if (!this.pickingFBO) {
      this.pickingFBO = new Framebuffer(gl);
    }

    this.pickingFBO.resize({
      width: gl.canvas.width,
      height: gl.canvas.height
    });
    return this.pickingFBO;
  }

  pickClosestObject(_ref4) {
    let layers = _ref4.layers,
        viewports = _ref4.viewports,
        x = _ref4.x,
        y = _ref4.y,
        radius = _ref4.radius,
        _ref4$depth = _ref4.depth,
        depth = _ref4$depth === void 0 ? 1 : _ref4$depth,
        mode = _ref4.mode,
        onViewportActive = _ref4.onViewportActive;
    this.updatePickingBuffer();
    const pixelRatio = this.pixelRatio;
    const deviceX = Math.round(x * pixelRatio);
    const deviceY = Math.round(this.gl.canvas.height - y * pixelRatio);
    const deviceRadius = Math.round(radius * pixelRatio);
    const _this$pickingFBO = this.pickingFBO,
          width = _this$pickingFBO.width,
          height = _this$pickingFBO.height;
    const deviceRect = this.getPickingRect({
      deviceX,
      deviceY,
      deviceRadius,
      deviceWidth: width,
      deviceHeight: height
    });
    let infos;
    const result = [];
    const affectedLayers = {};

    for (let i = 0; i < depth; i++) {
      const pickedColors = deviceRect && this.drawAndSamplePickingBuffer({
        layers,
        viewports,
        onViewportActive,
        deviceRect,
        redrawReason: mode
      });
      const pickInfo = getClosestObject({
        pickedColors,
        layers,
        deviceX,
        deviceY,
        deviceRadius,
        deviceRect
      });

      if (pickInfo.pickedColor && i + 1 < depth) {
        const layerId = pickInfo.pickedColor[3] - 1;

        if (!affectedLayers[layerId]) {
          affectedLayers[layerId] = layers[layerId].copyPickingColors();
        }

        layers[layerId].clearPickingColor(pickInfo.pickedColor);
      }

      infos = processPickInfo({
        pickInfo,
        lastPickedInfo: this.lastPickedInfo,
        mode,
        layers,
        viewports,
        x,
        y,
        deviceX,
        deviceY,
        pixelRatio
      });
      const processedPickInfos = this.callLayerPickingCallbacks(infos, mode);

      if (processedPickInfos) {
        processedPickInfos.forEach(info => result.push(info));
      }

      if (!pickInfo.pickedColor) {
        break;
      }
    }

    Object.keys(affectedLayers).forEach(layerId => layers[layerId].restorePickingColors(affectedLayers[layerId]));
    return {
      result,
      emptyInfo: infos && infos.get(null)
    };
  }

  pickVisibleObjects(_ref5) {
    let layers = _ref5.layers,
        viewports = _ref5.viewports,
        x = _ref5.x,
        y = _ref5.y,
        width = _ref5.width,
        height = _ref5.height,
        mode = _ref5.mode,
        onViewportActive = _ref5.onViewportActive;
    this.updatePickingBuffer();
    const pixelRatio = this.pixelRatio;
    const deviceLeft = Math.round(x * pixelRatio);
    const deviceBottom = Math.round(this.gl.canvas.height - y * pixelRatio);
    const deviceRight = Math.round((x + width) * pixelRatio);
    const deviceTop = Math.round(this.gl.canvas.height - (y + height) * pixelRatio);
    const deviceRect = {
      x: deviceLeft,
      y: deviceTop,
      width: deviceRight - deviceLeft,
      height: deviceBottom - deviceTop
    };
    const pickedColors = this.drawAndSamplePickingBuffer({
      layers,
      viewports,
      onViewportActive,
      deviceRect,
      redrawReason: mode
    });
    const pickInfos = getUniqueObjects({
      pickedColors,
      layers
    });
    const uniqueInfos = new Map();
    pickInfos.forEach(pickInfo => {
      let info = {
        color: pickInfo.pickedColor,
        layer: null,
        index: pickInfo.pickedObjectIndex,
        picked: true,
        x,
        y,
        width,
        height,
        pixelRatio
      };
      info = getLayerPickingInfo({
        layer: pickInfo.pickedLayer,
        info,
        mode
      });

      if (!uniqueInfos.has(info.object)) {
        uniqueInfos.set(info.object, info);
      }
    });
    return Array.from(uniqueInfos.values());
  }

  drawAndSamplePickingBuffer(_ref6) {
    let layers = _ref6.layers,
        viewports = _ref6.viewports,
        onViewportActive = _ref6.onViewportActive,
        deviceRect = _ref6.deviceRect,
        redrawReason = _ref6.redrawReason;
    assert(deviceRect);
    assert(Number.isFinite(deviceRect.width) && deviceRect.width > 0, '`width` must be > 0');
    assert(Number.isFinite(deviceRect.height) && deviceRect.height > 0, '`height` must be > 0');
    const pickableLayers = layers.filter(layer => layer.isPickable());

    if (pickableLayers.length < 1) {
      return null;
    }

    const pickingFBO = this.pickingFBO;
    const effectProps = {
      lightSources: {}
    };
    this.pickLayersPass.render({
      layers,
      viewports,
      onViewportActive,
      pickingFBO,
      deviceRect,
      redrawReason,
      effectProps
    });
    const x = deviceRect.x,
          y = deviceRect.y,
          width = deviceRect.width,
          height = deviceRect.height;
    const pickedColors = new Uint8Array(width * height * 4);
    readPixelsToArray(pickingFBO, {
      sourceX: x,
      sourceY: y,
      sourceWidth: width,
      sourceHeight: height,
      target: pickedColors
    });
    return pickedColors;
  }

  getPickingRect(_ref7) {
    let deviceX = _ref7.deviceX,
        deviceY = _ref7.deviceY,
        deviceRadius = _ref7.deviceRadius,
        deviceWidth = _ref7.deviceWidth,
        deviceHeight = _ref7.deviceHeight;
    const valid = deviceX >= 0 && deviceY >= 0 && deviceX < deviceWidth && deviceY < deviceHeight;

    if (!valid) {
      return null;
    }

    const x = Math.max(0, deviceX - deviceRadius);
    const y = Math.max(0, deviceY - deviceRadius);
    const width = Math.min(deviceWidth, deviceX + deviceRadius) - x + 1;
    const height = Math.min(deviceHeight, deviceY + deviceRadius) - y + 1;
    return {
      x,
      y,
      width,
      height
    };
  }

  callLayerPickingCallbacks(infos, mode) {
    const unhandledPickInfos = [];
    const pickingEvent = this.pickingEvent;
    infos.forEach(info => {
      if (!info.layer) {
        return;
      }

      let handled = false;

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

}
//# sourceMappingURL=deck-picker.js.map