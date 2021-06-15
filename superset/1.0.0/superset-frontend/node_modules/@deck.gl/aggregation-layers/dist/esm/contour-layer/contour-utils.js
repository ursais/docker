import { getCode, getVertices, CONTOUR_TYPE } from './marching-squares';
export function generateContours(_ref) {
  var thresholdData = _ref.thresholdData,
      colors = _ref.colors,
      cellWeights = _ref.cellWeights,
      gridSize = _ref.gridSize,
      gridOrigin = _ref.gridOrigin,
      cellSize = _ref.cellSize;
  var contourSegments = [];
  var contourPolygons = [];
  var width = gridSize[0];
  var height = gridSize[1];
  thresholdData.forEach(function (data, index) {
    var threshold = data.threshold;

    for (var x = -1; x < width; x++) {
      for (var y = -1; y < height; y++) {
        var _getCode = getCode({
          cellWeights: cellWeights,
          threshold: threshold,
          x: x,
          y: y,
          width: width,
          height: height
        }),
            code = _getCode.code,
            meanCode = _getCode.meanCode;

        var opts = {
          gridOrigin: gridOrigin,
          cellSize: cellSize,
          x: x,
          y: y,
          width: width,
          height: height,
          code: code,
          meanCode: meanCode,
          thresholdData: data
        };

        if (Array.isArray(threshold)) {
          opts.type = CONTOUR_TYPE.ISO_BANDS;
          var polygons = getVertices(opts);
          polygons.forEach(function (polygon) {
            contourPolygons.push({
              vertices: polygon,
              threshold: threshold
            });
          });
        } else {
          opts.type = CONTOUR_TYPE.ISO_LINES;
          var vertices = getVertices(opts);

          for (var i = 0; i < vertices.length; i += 2) {
            contourSegments.push({
              start: vertices[i],
              end: vertices[i + 1],
              threshold: threshold
            });
          }
        }
      }
    }
  });
  return {
    contourSegments: contourSegments,
    contourPolygons: contourPolygons
  };
}
//# sourceMappingURL=contour-utils.js.map