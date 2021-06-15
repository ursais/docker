import buildQueryObject from './buildQueryObject';
import DatasourceKey from './DatasourceKey';

const WRAP_IN_ARRAY = (baseQueryObject, options) => [baseQueryObject];

export default function buildQueryContext(formData, options) {
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
    datasource: new DatasourceKey(formData.datasource).toObject(),
    force: formData.force || false,
    queries: buildQuery(buildQueryObject(formData, queryFields), {
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