"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _transformProps = _interopRequireDefault(require("../legacyPlugin/transformProps"));

var _buildQuery = _interopRequireDefault(require("./buildQuery"));

var _thumbnail = _interopRequireDefault(require("../images/thumbnail.png"));

var _controlPanel = _interopRequireDefault(require("./controlPanel"));

var _configureEncodable = _interopRequireDefault(require("../configureEncodable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(0, _configureEncodable.default)();
const metadata = new _core.ChartMetadata({
  credits: ['https://github.com/jasondavies/d3-cloud'],
  description: '',
  name: (0, _core.t)('Word Cloud'),
  thumbnail: _thumbnail.default
});

class WordCloudChartPlugin extends _core.ChartPlugin {
  constructor() {
    super({
      buildQuery: _buildQuery.default,
      loadChart: () => Promise.resolve().then(() => _interopRequireWildcard(require('../chart/WordCloud'))),
      metadata,
      transformProps: _transformProps.default,
      controlPanel: _controlPanel.default
    });
  }

}

exports.default = WordCloudChartPlugin;