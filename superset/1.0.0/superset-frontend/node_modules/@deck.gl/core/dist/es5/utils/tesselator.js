"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _iterableUtils = require("./iterable-utils");

var TypedArrayManager = function () {
  function TypedArrayManager() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$overAlloc = _ref.overAlloc,
        overAlloc = _ref$overAlloc === void 0 ? 1 : _ref$overAlloc;

    (0, _classCallCheck2.default)(this, TypedArrayManager);
    this.overAlloc = overAlloc;
  }

  (0, _createClass2.default)(TypedArrayManager, [{
    key: "allocate",
    value: function allocate(typedArray, count, _ref2) {
      var size = _ref2.size,
          type = _ref2.type,
          _ref2$copy = _ref2.copy,
          copy = _ref2$copy === void 0 ? false : _ref2$copy;
      var newSize = count * size;

      if (typedArray && newSize <= typedArray.length) {
        return typedArray;
      }

      var allocSize = Math.max(Math.ceil(newSize * this.overAlloc), 1);

      var newArray = this._allocate(type, allocSize);

      if (typedArray && copy) {
        newArray.set(typedArray);
      }

      this._release(typedArray);

      return newArray;
    }
  }, {
    key: "_allocate",
    value: function _allocate() {
      var Type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Float32Array;
      var size = arguments.length > 1 ? arguments[1] : undefined;
      return new Type(size);
    }
  }, {
    key: "_release",
    value: function _release(typedArray) {}
  }]);
  return TypedArrayManager;
}();

var Tesselator = function () {
  function Tesselator() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Tesselator);
    var _opts$attributes = opts.attributes,
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

  (0, _createClass2.default)(Tesselator, [{
    key: "updateGeometry",
    value: function updateGeometry(_ref3) {
      var data = _ref3.data,
          getGeometry = _ref3.getGeometry,
          positionFormat = _ref3.positionFormat,
          fp64 = _ref3.fp64;
      this.data = data;
      this.getGeometry = getGeometry;
      this.fp64 = fp64;
      this.positionSize = positionFormat === 'XY' ? 2 : 3;

      this._rebuildGeometry();
    }
  }, {
    key: "updatePartialGeometry",
    value: function updatePartialGeometry(_ref4) {
      var startRow = _ref4.startRow,
          endRow = _ref4.endRow;

      this._rebuildGeometry({
        startRow: startRow,
        endRow: endRow
      });
    }
  }, {
    key: "updateGeometryAttributes",
    value: function updateGeometryAttributes(geometry, startIndex, size) {
      throw new Error('Not implemented');
    }
  }, {
    key: "getGeometrySize",
    value: function getGeometrySize(geometry) {
      throw new Error('Not implemented');
    }
  }, {
    key: "_forEachGeometry",
    value: function _forEachGeometry(visitor, startRow, endRow) {
      var data = this.data,
          getGeometry = this.getGeometry;

      var _createIterable = (0, _iterableUtils.createIterable)(data, startRow, endRow),
          iterable = _createIterable.iterable,
          objectInfo = _createIterable.objectInfo;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var object = _step.value;
          objectInfo.index++;
          var geometry = getGeometry(object, objectInfo);
          visitor(geometry, objectInfo.index);
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
    }
  }, {
    key: "_rebuildGeometry",
    value: function _rebuildGeometry(dataRange) {
      var _this = this;

      if (!this.data || !this.getGeometry) {
        return;
      }

      var indexLayout = this.indexLayout,
          bufferLayout = this.bufferLayout;

      if (!dataRange) {
        indexLayout = [];
        bufferLayout = [];
      }

      var _ref5 = dataRange || {},
          _ref5$startRow = _ref5.startRow,
          startRow = _ref5$startRow === void 0 ? 0 : _ref5$startRow,
          _ref5$endRow = _ref5.endRow,
          endRow = _ref5$endRow === void 0 ? Infinity : _ref5$endRow;

      this._forEachGeometry(function (geometry, dataIndex) {
        bufferLayout[dataIndex] = _this.getGeometrySize(geometry);
      }, startRow, endRow);

      var instanceCount = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = bufferLayout[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var count = _step2.value;
          instanceCount += count;
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

      var attributes = this.attributes,
          _attributeDefs = this._attributeDefs,
          typedArrayManager = this.typedArrayManager,
          fp64 = this.fp64;

      for (var name in _attributeDefs) {
        var def = _attributeDefs[name];
        def.copy = Boolean(dataRange);

        if (!def.fp64Only || fp64) {
          attributes[name] = typedArrayManager.allocate(attributes[name], instanceCount, def);
        }
      }

      this.indexLayout = indexLayout;
      this.bufferLayout = bufferLayout;
      this.instanceCount = instanceCount;
      var context = {
        vertexStart: 0,
        indexStart: 0
      };

      for (var i = 0; i < startRow; i++) {
        context.vertexStart += bufferLayout[i];
        context.indexStart += indexLayout[i] || 0;
      }

      this._forEachGeometry(function (geometry, dataIndex) {
        var geometrySize = bufferLayout[dataIndex];
        context.geometryIndex = dataIndex;
        context.geometrySize = geometrySize;

        _this.updateGeometryAttributes(geometry, context);

        context.vertexStart += geometrySize;
        context.indexStart += indexLayout[dataIndex] || 0;
      }, startRow, endRow);

      var vertexCount = context.indexStart;

      for (var _i = endRow; _i < indexLayout.length; _i++) {
        vertexCount += indexLayout[_i];
      }

      this.vertexCount = vertexCount;
    }
  }]);
  return Tesselator;
}();

exports.default = Tesselator;
//# sourceMappingURL=tesselator.js.map