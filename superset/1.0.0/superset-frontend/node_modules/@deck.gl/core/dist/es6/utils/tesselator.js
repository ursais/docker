import { createIterable } from './iterable-utils';

class TypedArrayManager {
  constructor() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$overAlloc = _ref.overAlloc,
        overAlloc = _ref$overAlloc === void 0 ? 1 : _ref$overAlloc;

    this.overAlloc = overAlloc;
  }

  allocate(typedArray, count, _ref2) {
    let size = _ref2.size,
        type = _ref2.type,
        _ref2$copy = _ref2.copy,
        copy = _ref2$copy === void 0 ? false : _ref2$copy;
    const newSize = count * size;

    if (typedArray && newSize <= typedArray.length) {
      return typedArray;
    }

    const allocSize = Math.max(Math.ceil(newSize * this.overAlloc), 1);

    const newArray = this._allocate(type, allocSize);

    if (typedArray && copy) {
      newArray.set(typedArray);
    }

    this._release(typedArray);

    return newArray;
  }

  _allocate() {
    let Type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Float32Array;
    let size = arguments.length > 1 ? arguments[1] : undefined;
    return new Type(size);
  }

  _release(typedArray) {}

}

export default class Tesselator {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _opts$attributes = opts.attributes,
          attributes = _opts$attributes === void 0 ? {} : _opts$attributes;
    this.typedArrayManager = new TypedArrayManager();
    this.indexLayout = null;
    this.bufferLayout = null;
    this.vertexCount = 0;
    this.instanceCount = 0;
    this.attributes = {};
    this._attributeDefs = attributes;
    this.updateGeometry(opts);
    Object.seal(this);
  }

  updateGeometry(_ref3) {
    let data = _ref3.data,
        getGeometry = _ref3.getGeometry,
        positionFormat = _ref3.positionFormat,
        fp64 = _ref3.fp64;
    this.data = data;
    this.getGeometry = getGeometry;
    this.fp64 = fp64;
    this.positionSize = positionFormat === 'XY' ? 2 : 3;

    this._rebuildGeometry();
  }

  updatePartialGeometry(_ref4) {
    let startRow = _ref4.startRow,
        endRow = _ref4.endRow;

    this._rebuildGeometry({
      startRow,
      endRow
    });
  }

  updateGeometryAttributes(geometry, startIndex, size) {
    throw new Error('Not implemented');
  }

  getGeometrySize(geometry) {
    throw new Error('Not implemented');
  }

  _forEachGeometry(visitor, startRow, endRow) {
    const data = this.data,
          getGeometry = this.getGeometry;

    const _createIterable = createIterable(data, startRow, endRow),
          iterable = _createIterable.iterable,
          objectInfo = _createIterable.objectInfo;

    for (const object of iterable) {
      objectInfo.index++;
      const geometry = getGeometry(object, objectInfo);
      visitor(geometry, objectInfo.index);
    }
  }

  _rebuildGeometry(dataRange) {
    if (!this.data || !this.getGeometry) {
      return;
    }

    let indexLayout = this.indexLayout,
        bufferLayout = this.bufferLayout;

    if (!dataRange) {
      indexLayout = [];
      bufferLayout = [];
    }

    const _ref5 = dataRange || {},
          _ref5$startRow = _ref5.startRow,
          startRow = _ref5$startRow === void 0 ? 0 : _ref5$startRow,
          _ref5$endRow = _ref5.endRow,
          endRow = _ref5$endRow === void 0 ? Infinity : _ref5$endRow;

    this._forEachGeometry((geometry, dataIndex) => {
      bufferLayout[dataIndex] = this.getGeometrySize(geometry);
    }, startRow, endRow);

    let instanceCount = 0;

    for (const count of bufferLayout) {
      instanceCount += count;
    }

    const attributes = this.attributes,
          _attributeDefs = this._attributeDefs,
          typedArrayManager = this.typedArrayManager,
          fp64 = this.fp64;

    for (const name in _attributeDefs) {
      const def = _attributeDefs[name];
      def.copy = Boolean(dataRange);

      if (!def.fp64Only || fp64) {
        attributes[name] = typedArrayManager.allocate(attributes[name], instanceCount, def);
      }
    }

    this.indexLayout = indexLayout;
    this.bufferLayout = bufferLayout;
    this.instanceCount = instanceCount;
    const context = {
      vertexStart: 0,
      indexStart: 0
    };

    for (let i = 0; i < startRow; i++) {
      context.vertexStart += bufferLayout[i];
      context.indexStart += indexLayout[i] || 0;
    }

    this._forEachGeometry((geometry, dataIndex) => {
      const geometrySize = bufferLayout[dataIndex];
      context.geometryIndex = dataIndex;
      context.geometrySize = geometrySize;
      this.updateGeometryAttributes(geometry, context);
      context.vertexStart += geometrySize;
      context.indexStart += indexLayout[dataIndex] || 0;
    }, startRow, endRow);

    let vertexCount = context.indexStart;

    for (let i = endRow; i < indexLayout.length; i++) {
      vertexCount += indexLayout[i];
    }

    this.vertexCount = vertexCount;
  }

}
//# sourceMappingURL=tesselator.js.map