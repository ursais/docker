import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import { log } from '@deck.gl/core';
import { Geometry, uid } from '@luma.gl/core';
export default class ColumnGeometry extends Geometry {
  constructor() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _props$id = props.id,
          id = _props$id === void 0 ? uid('column-geometry') : _props$id;

    const _tesselateColumn = tesselateColumn(props),
          indices = _tesselateColumn.indices,
          attributes = _tesselateColumn.attributes;

    super(_objectSpread({}, props, {
      id,
      indices,
      attributes
    }));
  }

}

function tesselateColumn(props) {
  const radius = props.radius,
        _props$height = props.height,
        height = _props$height === void 0 ? 1 : _props$height,
        _props$nradial = props.nradial,
        nradial = _props$nradial === void 0 ? 10 : _props$nradial,
        vertices = props.vertices;
  log.assert(!vertices || vertices.length >= nradial);
  const vertsAroundEdge = nradial + 1;
  const numVertices = vertsAroundEdge * 3;
  const stepAngle = Math.PI * 2 / nradial;
  const indices = new Uint16Array(nradial * 3 * 2);
  const positions = new Float32Array(numVertices * 3);
  const normals = new Float32Array(numVertices * 3);
  let i = 0;

  for (let j = 0; j < vertsAroundEdge; j++) {
    const a = j * stepAngle;
    const vertex = vertices && vertices[j % nradial];
    const nextVertex = vertices && vertices[(j + 1) % nradial];
    const sin = Math.sin(a);
    const cos = Math.cos(a);

    for (let k = 0; k < 2; k++) {
      positions[i + 0] = vertex ? vertex[0] : cos * radius;
      positions[i + 1] = vertex ? vertex[1] : sin * radius;
      positions[i + 2] = (1 / 2 - k) * height;
      normals[i + 0] = vertex ? nextVertex[0] - vertex[0] : cos;
      normals[i + 1] = vertex ? nextVertex[1] - vertex[1] : sin;
      i += 3;
    }
  }

  for (let j = 0; j < vertsAroundEdge; j++) {
    const v = Math.floor(j / 2) * Math.sign(j % 2 - 0.5);
    const a = v * stepAngle;
    const vertex = vertices && vertices[(v + nradial) % nradial];
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    positions[i + 0] = vertex ? vertex[0] : cos * radius;
    positions[i + 1] = vertex ? vertex[1] : sin * radius;
    positions[i + 2] = height / 2;
    normals[i + 2] = 1;
    i += 3;
  }

  let index = 0;

  for (let j = 0; j < nradial; j++) {
    indices[index++] = j * 2 + 0;
    indices[index++] = j * 2 + 2;
    indices[index++] = j * 2 + 0;
    indices[index++] = j * 2 + 1;
    indices[index++] = j * 2 + 1;
    indices[index++] = j * 2 + 3;
  }

  return {
    indices,
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