import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Buffer, hasFeature, FEATURES } from '@luma.gl/core';
import { log, uid } from '@luma.gl/core';

var BaseAttribute = function () {
  function BaseAttribute(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BaseAttribute);

    var _opts$id = opts.id,
        id = _opts$id === void 0 ? uid('attribute') : _opts$id,
        type = opts.type,
        _opts$isIndexed = opts.isIndexed,
        isIndexed = _opts$isIndexed === void 0 ? false : _opts$isIndexed;
    this.gl = gl;
    this.id = id;
    this.isIndexed = isIndexed;
    this.target = isIndexed ? 34963 : 34962;
    this.type = type;

    if (isIndexed && !type) {
      this.type = gl && hasFeature(gl, FEATURES.ELEMENT_INDEX_UINT32) ? 5125 : 5123;
    }

    this.value = null;
    this.externalBuffer = null;
    this.buffer = null;
    this.userData = {};
    this.update(opts);

    this._validateAttributeDefinition();
  }

  _createClass(BaseAttribute, [{
    key: "delete",
    value: function _delete() {
      if (this.buffer) {
        this.buffer.delete();
        this.buffer = null;
      }
    }
  }, {
    key: "update",
    value: function update(opts) {
      var value = opts.value,
          buffer = opts.buffer,
          _opts$constant = opts.constant,
          constant = _opts$constant === void 0 ? this.constant || false : _opts$constant;
      this.constant = constant;

      if (buffer) {
        this.externalBuffer = buffer;
        this.constant = false;
        this.type = opts.type || buffer.accessor.type;

        if (buffer.accessor.divisor !== undefined) {
          this.divisor = buffer.accessor.divisor;
        }

        if (opts.divisor !== undefined) {
          this.divisor = opts.divisor;
        }
      } else if (value) {
        this.externalBuffer = null;
        var size = this.size || opts.size || 0;

        if (constant && value.length !== size) {
          this.value = new Float32Array(size);
          var index = this.offset / 4;

          for (var i = 0; i < this.size; ++i) {
            this.value[i] = value[index + i];
          }
        } else {
          this.value = value;
        }

        if (!constant && this.gl) {
          this.buffer = this.buffer || this._createBuffer(opts);
          this.buffer.setData({
            data: value
          });
          this.type = this.buffer.accessor.type;
        }
      }

      this._setAccessor(opts);
    }
  }, {
    key: "getBuffer",
    value: function getBuffer() {
      if (this.constant) {
        return null;
      }

      return this.externalBuffer || this.buffer;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      if (this.constant) {
        return this.value;
      }

      var buffer = this.externalBuffer || this.buffer;

      if (buffer) {
        return [buffer, this];
      }

      return null;
    }
  }, {
    key: "_createBuffer",
    value: function _createBuffer(opts) {
      var props = Object.assign({}, opts, {
        id: this.id,
        target: this.target,
        accessor: {
          type: this.type
        }
      });

      if (Number.isFinite(props.divisor)) {
        props.accessor.divisor = props.divisor;
      }

      delete props.divisor;

      if (Number.isFinite(props.size)) {
        props.accessor.size = props.size;
      }

      delete props.size;
      return new Buffer(this.gl, props);
    }
  }, {
    key: "_setAccessor",
    value: function _setAccessor(opts) {
      var _opts$size = opts.size,
          size = _opts$size === void 0 ? this.size : _opts$size,
          _opts$offset = opts.offset,
          offset = _opts$offset === void 0 ? this.offset || 0 : _opts$offset,
          _opts$stride = opts.stride,
          stride = _opts$stride === void 0 ? this.stride || 0 : _opts$stride,
          _opts$normalized = opts.normalized,
          normalized = _opts$normalized === void 0 ? this.normalized || false : _opts$normalized,
          _opts$integer = opts.integer,
          integer = _opts$integer === void 0 ? this.integer || false : _opts$integer,
          _opts$divisor = opts.divisor,
          divisor = _opts$divisor === void 0 ? this.divisor || 0 : _opts$divisor,
          instanced = opts.instanced,
          isInstanced = opts.isInstanced;
      this.size = size;
      this.offset = offset;
      this.stride = stride;
      this.normalized = normalized;
      this.integer = integer;
      this.divisor = divisor;

      if (isInstanced !== undefined) {
        log.deprecated('Attribute.isInstanced')();
        this.divisor = isInstanced ? 1 : 0;
      }

      if (instanced !== undefined) {
        log.deprecated('Attribute.instanced')();
        this.divisor = instanced ? 1 : 0;
      }
    }
  }, {
    key: "_validateAttributeDefinition",
    value: function _validateAttributeDefinition() {}
  }]);

  return BaseAttribute;
}();

export { BaseAttribute as default };
//# sourceMappingURL=base-attribute.js.map