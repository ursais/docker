import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { log } from '@deck.gl/core';
import { Geometry, uid } from '@luma.gl/core';

var ColumnGeometry = function (_Geometry) {
  _inherits(ColumnGeometry, _Geometry);

  function ColumnGeometry() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ColumnGeometry);

    var _props$id = props.id,
        id = _props$id === void 0 ? uid('column-geometry') : _props$id;

    var _tesselateColumn = tesselateColumn(props),
        indices = _tesselateColumn.indices,
        attributes = _tesselateColumn.attributes;

    return _possibleConstructorReturn(this, _getPrototypeOf(ColumnGeometry).call(this, _objectSpread({}, props, {
      id: id,
      indices: indices,
      attributes: attributes
    })));
  }

  return ColumnGeometry;
}(Geometry);

export { ColumnGeometry as default };

function tesselateColumn(props) {
  var radius = props.radius,
      _props$height = props.height,
      height = _props$height === void 0 ? 1 : _props$height,
      _props$nradial = props.nradial,
      nradial = _props$nradial === void 0 ? 10 : _props$nradial,
      vertices = props.vertices;
  log.assert(!vertices || vertices.length >= nradial);
  var vertsAroundEdge = nradial + 1;
  var numVertices = vertsAroundEdge * 3;
  var stepAngle = Math.PI * 2 / nradial;
  var indices = new Uint16Array(nradial * 3 * 2);
  var positions = new Float32Array(numVertices * 3);
  var normals = new Float32Array(numVertices * 3);
  var i = 0;

  for (var j = 0; j < vertsAroundEdge; j++) {
    var a = j * stepAngle;
    var vertex = vertices && vertices[j % nradial];
    var nextVertex = vertices && vertices[(j + 1) % nradial];
    var sin = Math.sin(a);
    var cos = Math.cos(a);

    for (var k = 0; k < 2; k++) {
      positions[i + 0] = vertex ? vertex[0] : cos * radius;
      positions[i + 1] = vertex ? vertex[1] : sin * radius;
      positions[i + 2] = (1 / 2 - k) * height;
      normals[i + 0] = vertex ? nextVertex[0] - vertex[0] : cos;
      normals[i + 1] = vertex ? nextVertex[1] - vertex[1] : sin;
      i += 3;
    }
  }

  for (var _j = 0; _j < vertsAroundEdge; _j++) {
    var v = Math.floor(_j / 2) * Math.sign(_j % 2 - 0.5);

    var _a = v * stepAngle;

    var _vertex = vertices && vertices[(v + nradial) % nradial];

    var _sin = Math.sin(_a);

    var _cos = Math.cos(_a);

    positions[i + 0] = _vertex ? _vertex[0] : _cos * radius;
    positions[i + 1] = _vertex ? _vertex[1] : _sin * radius;
    positions[i + 2] = height / 2;
    normals[i + 2] = 1;
    i += 3;
  }

  var index = 0;

  for (var _j2 = 0; _j2 < nradial; _j2++) {
    indices[index++] = _j2 * 2 + 0;
    indices[index++] = _j2 * 2 + 2;
    indices[index++] = _j2 * 2 + 0;
    indices[index++] = _j2 * 2 + 1;
    indices[index++] = _j2 * 2 + 1;
    indices[index++] = _j2 * 2 + 3;
  }

  return {
    indices: indices,
    attributes: {
      POSITION: {
        size: 3,
        value: positions
      },
      NORMAL: {
        size: 3,
        value: normals
      }
    }
  };
}
//# sourceMappingURL=column-geometry.js.map