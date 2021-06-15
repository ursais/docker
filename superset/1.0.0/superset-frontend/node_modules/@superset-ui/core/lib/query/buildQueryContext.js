"use strict";

exports.__esModule = true;
exports.default = buildQueryContext;

var _buildQueryObject = _interopRequireDefault(require("./buildQueryObject"));

var _DatasourceKey = _interopRequireDefault(require("./DatasourceKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WRAP_IN_ARRAY = (baseQueryObject, options) => [baseQueryObject];

function buildQueryContext(formData, options) {
  const {
    queryFields,
    buildQuery = WRAP_IN_ARRAY,
    hooks = {},
    ownState = {}
  } = typeof options === 'function' ? {
    buildQuery: options,
    queryFields: {}
  } : options || {};
  return {
    datasource: new _DatasourceKey.default(formData.datasource).toObject(),
    force: formData.force || false,
    queries: buildQuery((0, _buildQueryObject.default)(formData, queryFields), {
      extras: {},
      ownState,
      hooks: {
        setDataMask: () => {},
        setCachedChanges: () => {},
        ...hooks
      }
    }),
    result_format: formData.result_format || 'json',
    result_type: formData.result_type || 'full'
  };
}