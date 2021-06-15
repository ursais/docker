"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _transformProps = _interopRequireDefault(require("../transformProps"));

var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));

var _AnnotationTypes = require("../vendor/superset/AnnotationTypes");

var _controlPanel = _interopRequireDefault(require("./controlPanel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const metadata = new _core.ChartMetadata({
  credits: ['http://nvd3.org'],
  description: '',
  name: (0, _core.t)('Area Chart'),
  supportedAnnotationTypes: [_AnnotationTypes.ANNOTATION_TYPES.INTERVAL, _AnnotationTypes.ANNOTATION_TYPES.EVENT],
  thumbnail: _thumbnail.default,
  useLegacyApi: true
});

class AreaChartPlugin extends _core.ChartPlugin {
  constructor() {
    super({
      loadChart: () => Promise.resolve().then(() => _interopRequireWildcard(require('../ReactNVD3'))),
      metadata,
      transformProps: _transformProps.default,
      controlPanel: _controlPanel.default
    });
  }

}

exports.default = AreaChartPlugin;