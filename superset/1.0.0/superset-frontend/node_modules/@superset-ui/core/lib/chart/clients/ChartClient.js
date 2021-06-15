"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

var _ChartBuildQueryRegistrySingleton = _interopRequireDefault(require("../registries/ChartBuildQueryRegistrySingleton"));

var _ChartMetadataRegistrySingleton = _interopRequireDefault(require("../registries/ChartMetadataRegistrySingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChartClient {
  constructor(config = {}) {
    this.client = void 0;
    const {
      client = _.SupersetClient
    } = config;
    this.client = client;
  }

  loadFormData(input, options) {
    /* If sliceId is provided, use it to fetch stored formData from API */
    if ('sliceId' in input) {
      const promise = this.client.get({
        endpoint: `/api/v1/form_data/?slice_id=${input.sliceId}`,
        ...options
      }).then(response => response.json);
      /*
       * If formData is also specified, override API result
       * with user-specified formData
       */

      return promise.then(dbFormData => ({ ...dbFormData,
        ...input.formData
      }));
    }
    /* If sliceId is not provided, returned formData wrapped in a Promise */


    return input.formData ? Promise.resolve(input.formData) : Promise.reject(new Error('At least one of sliceId or formData must be specified'));
  }

  async loadQueryData(formData, options) {
    const {
      viz_type: visType
    } = formData;
    const metaDataRegistry = (0, _ChartMetadataRegistrySingleton.default)();
    const buildQueryRegistry = (0, _ChartBuildQueryRegistrySingleton.default)();

    if (metaDataRegistry.has(visType)) {
      var _await$buildQueryRegi;

      const {
        useLegacyApi
      } = metaDataRegistry.get(visType);
      const buildQuery = (_await$buildQueryRegi = await buildQueryRegistry.get(visType)) != null ? _await$buildQueryRegi : () => formData;
      const requestConfig = useLegacyApi ? {
        endpoint: '/superset/explore_json/',
        postPayload: {
          form_data: buildQuery(formData)
        },
        ...options
      } : {
        endpoint: '/api/v1/chart/data',
        jsonPayload: {
          query_context: buildQuery(formData)
        },
        ...options
      };
      return this.client.post(requestConfig).then(response => Array.isArray(response.json) ? response.json : [response.json]);
    }

    return Promise.reject(new Error(`Unknown chart type: ${visType}`));
  }

  loadDatasource(datasourceKey, options) {
    return this.client.get({
      endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`,
      ...options
    }).then(response => response.json);
  } // eslint-disable-next-line class-methods-use-this


  loadAnnotation(annotationLayer) {
    /* When annotation does not require query */
    if (!(0, _.isDefined)(annotationLayer.sourceType)) {
      return Promise.resolve({});
    } // TODO: Implement


    return Promise.reject(new Error('This feature is not implemented yet.'));
  }

  loadAnnotations(annotationLayers) {
    if (Array.isArray(annotationLayers) && annotationLayers.length > 0) {
      return Promise.all(annotationLayers.map(layer => this.loadAnnotation(layer))).then(results => annotationLayers.reduce((prev, layer, i) => {
        const output = prev;
        output[layer.name] = results[i];
        return output;
      }, {}));
    }

    return Promise.resolve({});
  }

  loadChartData(input) {
    return this.loadFormData(input).then(formData => Promise.all([this.loadAnnotations(formData.annotation_layers), this.loadDatasource(formData.datasource), this.loadQueryData(formData)]).then(([annotationData, datasource, queriesData]) => ({
      annotationData,
      datasource,
      formData,
      queriesData
    })));
  }

}

exports.default = ChartClient;