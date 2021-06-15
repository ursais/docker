import log from '../../utils/log';
const NO_PICKED_OBJECT = {
  pickedColor: null,
  pickedLayer: null,
  pickedObjectIndex: -1
};
export function getClosestObject(_ref) {
  let pickedColors = _ref.pickedColors,
      layers = _ref.layers,
      deviceX = _ref.deviceX,
      deviceY = _ref.deviceY,
      deviceRadius = _ref.deviceRadius,
      deviceRect = _ref.deviceRect;

  if (pickedColors) {
    const x = deviceRect.x,
          y = deviceRect.y,
          width = deviceRect.width,
          height = deviceRect.height;
    let minSquareDistanceToCenter = deviceRadius * deviceRadius;
    let closestPixelIndex = -1;
    let i = 0;

    for (let row = 0; row < height; row++) {
      const dy = row + y - deviceY;
      const dy2 = dy * dy;

      if (dy2 > minSquareDistanceToCenter) {
        i += 4 * width;
      } else {
        for (let col = 0; col < width; col++) {
          const pickedLayerIndex = pickedColors[i + 3] - 1;

          if (pickedLayerIndex >= 0) {
            const dx = col + x - deviceX;
            const d2 = dx * dx + dy2;

            if (d2 <= minSquareDistanceToCenter) {
              minSquareDistanceToCenter = d2;
              closestPixelIndex = i;
            }
          }

          i += 4;
        }
      }
    }

    if (closestPixelIndex >= 0) {
      const pickedLayerIndex = pickedColors[closestPixelIndex + 3] - 1;
      const pickedColor = pickedColors.slice(closestPixelIndex, closestPixelIndex + 4);
      const pickedLayer = layers[pickedLayerIndex];

      if (pickedLayer) {
        const pickedObjectIndex = pickedLayer.decodePickingColor(pickedColor);
        return {
          pickedColor,
          pickedLayer,
          pickedObjectIndex
        };
      }

      log.error('Picked non-existent layer. Is picking buffer corrupt?')();
    }
  }

  return NO_PICKED_OBJECT;
}
export function getUniqueObjects(_ref2) {
  let pickedColors = _ref2.pickedColors,
      layers = _ref2.layers;
  const uniqueColors = new Map();

  if (pickedColors) {
    for (let i = 0; i < pickedColors.length; i += 4) {
      const pickedLayerIndex = pickedColors[i + 3] - 1;

      if (pickedLayerIndex >= 0) {
        const pickedColor = pickedColors.slice(i, i + 4);
        const colorKey = pickedColor.join(',');

        if (!uniqueColors.has(colorKey)) {
          const pickedLayer = layers[pickedLayerIndex];

          if (pickedLayer) {
            uniqueColors.set(colorKey, {
              pickedColor,
              pickedLayer,
              pickedObjectIndex: pickedLayer.decodePickingColor(pickedColor)
            });
          } else {
            log.error('Picked non-existent layer. Is picking buffer corrupt?')();
          }
        }
      }
    }
  }

  return Array.from(uniqueColors.values());
}
//# sourceMappingURL=query-object.js.map