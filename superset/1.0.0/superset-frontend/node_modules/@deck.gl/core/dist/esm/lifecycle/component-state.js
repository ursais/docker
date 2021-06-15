import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import log from '../utils/log';
import assert from '../utils/assert';
var EMPTY_PROPS = Object.freeze({});

var ComponentState = function () {
  function ComponentState() {
    var component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ComponentState);

    this.component = component;
    this.asyncProps = {};

    this.onAsyncPropUpdated = function () {};

    this.oldProps = EMPTY_PROPS;
    this.oldAsyncProps = null;
  }

  _createClass(ComponentState, [{
    key: "getOldProps",
    value: function getOldProps() {
      return this.oldAsyncProps || this.oldProps;
    }
  }, {
    key: "resetOldProps",
    value: function resetOldProps() {
      this.oldAsyncProps = null;
      this.oldProps = this.component.props;
    }
  }, {
    key: "freezeAsyncOldProps",
    value: function freezeAsyncOldProps() {
      if (!this.oldAsyncProps) {
        this.oldProps = this.oldProps || this.component.props;
        this.oldAsyncProps = {};

        for (var propName in this.oldProps) {
          this.oldAsyncProps[propName] = this.oldProps[propName];
        }
      }
    }
  }, {
    key: "hasAsyncProp",
    value: function hasAsyncProp(propName) {
      return propName in this.asyncProps;
    }
  }, {
    key: "getAsyncProp",
    value: function getAsyncProp(propName) {
      var asyncProp = this.asyncProps[propName];
      return asyncProp && asyncProp.resolvedValue;
    }
  }, {
    key: "isAsyncPropLoading",
    value: function isAsyncPropLoading(propName) {
      var asyncProp = this.asyncProps[propName];
      return Boolean(asyncProp && asyncProp.pendingLoadCount > 0 && asyncProp.pendingLoadCount !== asyncProp.resolvedLoadCount);
    }
  }, {
    key: "setAsyncProps",
    value: function setAsyncProps(props) {
      var resolvedValues = props._asyncPropResolvedValues || {};
      var originalValues = props._asyncPropOriginalValues || props;
      var defaultValues = props._asyncPropDefaultValues || {};

      for (var propName in resolvedValues) {
        var value = resolvedValues[propName];

        this._createAsyncPropData(propName, value, defaultValues[propName]);

        this._updateAsyncProp(propName, value);
      }

      for (var _propName in originalValues) {
        var _value = originalValues[_propName];

        this._createAsyncPropData(_propName, _value, defaultValues[_propName]);

        this._updateAsyncProp(_propName, _value);
      }
    }
  }, {
    key: "_updateAsyncProp",
    value: function _updateAsyncProp(propName, value) {
      if (!this._didAsyncInputValueChange(propName, value)) {
        return;
      }

      if (typeof value === 'string') {
        var fetch = this.layer.props.fetch;
        var url = value;
        value = fetch(url, {
          propName: propName,
          layer: this.layer
        });
      }

      if (value instanceof Promise) {
        this._watchPromise(propName, value);

        return;
      }

      this._setPropValue(propName, value);
    }
  }, {
    key: "_didAsyncInputValueChange",
    value: function _didAsyncInputValueChange(propName, value) {
      var asyncProp = this.asyncProps[propName];

      if (value === asyncProp.lastValue) {
        return false;
      }

      asyncProp.lastValue = value;
      return true;
    }
  }, {
    key: "_setPropValue",
    value: function _setPropValue(propName, value) {
      var asyncProp = this.asyncProps[propName];
      asyncProp.value = value;
      asyncProp.resolvedValue = value;
      asyncProp.pendingLoadCount++;
      asyncProp.resolvedLoadCount = asyncProp.pendingLoadCount;
    }
  }, {
    key: "_setAsyncPropValue",
    value: function _setAsyncPropValue(propName, value, loadCount) {
      var asyncProp = this.asyncProps[propName];

      if (asyncProp && loadCount >= asyncProp.resolvedLoadCount) {
        assert(value !== undefined);
        this.freezeAsyncOldProps();
        value = this._postProcessValue(propName, value);
        asyncProp.resolvedValue = value;
        asyncProp.resolvedLoadCount = loadCount;
        this.onAsyncPropUpdated(propName, value);
      }
    }
  }, {
    key: "_watchPromise",
    value: function _watchPromise(propName, promise) {
      var _this = this;

      var asyncProp = this.asyncProps[propName];
      asyncProp.pendingLoadCount++;
      var loadCount = asyncProp.pendingLoadCount;
      promise.then(function (data) {
        return _this._setAsyncPropValue(propName, data, loadCount);
      }).catch(function (error) {
        return log.error(error)();
      });
    }
  }, {
    key: "_postProcessValue",
    value: function _postProcessValue(propName, value) {
      var _ref = this.component ? this.component.props : {},
          dataTransform = _ref.dataTransform;

      if (propName === 'data' && dataTransform) {
        value = dataTransform(value);
      }

      return value;
    }
  }, {
    key: "_createAsyncPropData",
    value: function _createAsyncPropData(propName, value, defaultValue) {
      var asyncProp = this.asyncProps[propName];

      if (!asyncProp) {
        this.asyncProps[propName] = {
          lastValue: null,
          resolvedValue: defaultValue,
          pendingLoadCount: 0,
          resolvedLoadCount: 0
        };
      }
    }
  }]);

  return ComponentState;
}();

export { ComponentState as default };
//# sourceMappingURL=component-state.js.map