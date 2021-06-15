export var defaultColorRange = [[255, 255, 178], [254, 217, 118], [254, 178, 76], [253, 141, 60], [240, 59, 32], [189, 0, 38]];
export function colorRangeToFlatArray(colorRange, ArrayType, defaultValue) {
  var flatArray = new ArrayType(colorRange.length * 4);
  colorRange.forEach(function (color, index) {
    var flatArrayIdnex = index * 4;
    flatArray[flatArrayIdnex] = color[0];
    flatArray[flatArrayIdnex + 1] = color[1];
    flatArray[flatArrayIdnex + 2] = color[2];
    flatArray[flatArrayIdnex + 3] = Number.isFinite(color[3]) ? color[3] : defaultValue;
  });
  return flatArray;
}
//# sourceMappingURL=color-utils.js.map