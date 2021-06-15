"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@deck.gl/core");

var _core2 = require("@luma.gl/core");

var ColumnGeometry = function (_Geometry) {
  (0, _inherits2.default)(ColumnGeometry, _Geometry);

  function ColumnGeometry() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, ColumnGeometry);
    var _props$id = props.id,
        id = _props$id === void 0 ? (0, _core2.uid)('column-geometry') : _props$id;

    var _tesselateColumn = tesselateColumn(props),
        indices = _tesselateColumn.indices,
        attributes = _tesselateColumn.attributes;

    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ColumnGeometry).call(this, (0, _objectSpread2.default)({}, props, {
      id: id,
      indices: indices,
      attributes: attributes
    })));
  }

  return ColumnGeometry;
}(_core2.Geometry);

exports.default = ColumnGeometry;

function tesselateColumn(props) {
  var radius = props.radius,
      _props$height = props.height,
      height = _props$height === void 0 ? 1 : _props$height,
      _props$nradial = props.nradial,
      nradial = _props$nradial === void 0 ? 10 : _props$nradial,
      vertices = props.vertices;

  _core.log.assert(!vertices || vertices.length >= nradial);

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