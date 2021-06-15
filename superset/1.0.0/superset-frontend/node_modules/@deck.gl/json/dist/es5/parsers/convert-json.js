"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertTopLevelJSON = convertTopLevelJSON;
exports.getJSONLayers = getJSONLayers;

var _core = require("@deck.gl/core");

var _jsonLayer = _interopRequireDefault(require("../json-layer/json-layer"));

var _get = require("../utils/get");

var _d3Dsv = require("d3-dsv");

var DEFAULT_VIEW_CATALOG = {
  MapView: _core.MapView,
  FirstPersonView: _core.FirstPersonView,
  OrbitView: _core.OrbitView,
  OrthographicView: _core.OrthographicView
};
var DEFAULT_MAP_PROPS = {
  style: 'mapbox://styles/mapbox/light-v9'
};

function convertTopLevelJSON(json, configuration) {
  var jsonProps = json;

  if (jsonProps.layers) {
    jsonProps.layers = convertJSONLayers(json.layers, configuration);
  }

  if (jsonProps.views) {
    jsonProps.views = convertJSONViews(json.views, configuration);
  }

  if ('initialViewState' in jsonProps) {
    jsonProps.viewState = jsonProps.viewState || jsonProps.initialViewState;
  }

  convertJSONMapProps(jsonProps, configuration);
  return jsonProps;
}

function convertJSONMapProps(jsonProps, configuration) {
  if (jsonProps.map || jsonProps.mapStyle) {
    jsonProps.map = Object.assign({}, DEFAULT_MAP_PROPS, jsonProps.map);
  }

  if (!jsonProps.map) {
    return;
  }

  if ('mapStyle' in jsonProps) {
    jsonProps.map.style = jsonProps.mapStyle;
    jsonProps.map.mapStyle = jsonProps.mapStyle;
    delete jsonProps.mapStyle;
  }

  if ('viewState' in jsonProps) {
    jsonProps.map.viewState = jsonProps.viewState;
  }
}

function convertJSONLayers(jsonLayers, configuration) {
  return [new _jsonLayer.default({
    data: jsonLayers,
    configuration: configuration
  })];
}

function convertJSONViews(jsonViews, configuration) {
  if (!jsonViews) {
    return jsonViews;
  }

  var viewCatalog = configuration.views || {};
  jsonViews = Array.isArray(jsonViews) ? jsonViews : [jsonViews];
  return jsonViews.map(function (jsonView) {
    var View = viewCatalog[jsonView.type] || DEFAULT_VIEW_CATALOG[jsonView.type];

    if (View) {
      var viewProps = Object.assign({}, jsonView);
      delete viewProps.type;
      return new View(viewProps);
    }

    return null;
  }).filter(Boolean);
}

function getJSONLayers() {
  var jsonLayers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var configuration = arguments.length > 1 ? arguments[1] : undefined;
  var layerCatalog = configuration.layers || {};
  return jsonLayers.map(function (jsonLayer) {
    var Layer = layerCatalog[jsonLayer.type];
    var props = getJSONLayerProps(jsonLayer, configuration);
    props.fetch = enhancedFetch;
    return Layer && new Layer(props);
  });
}

function getJSONLayerProps(jsonProps, configuration) {
  var replacedProps = {};

  for (var propName in jsonProps) {
    var propValue = jsonProps[propName];

    if (propName.startsWith('get')) {
      replacedProps[propName] = getJSONAccessor(propValue, configuration);
    } else {
      replacedProps[propName] = propValue;
    }
  }

  return replacedProps;
}

function getJSONAccessor(propValue, configuration) {
  if (propValue === '-') {
    return function (object) {
      return object;
    };
  }

  if (typeof propValue === 'string') {
    return function (object) {
      return (0, _get.get)(object, propValue);
    };
  }

  return propValue;
}

function enhancedFetch(url) {
  return fetch(url).then(function (response) {
    return response.text();
  }).then(function (text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return parseCSV(text);
    }
  });
}

function parseCSV(text) {
  var csv = (0, _d3Dsv.csvParseRows)(text);

  if (csv.length > 0) {
    csv.shift();
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = csv[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var row = _step.value;

      for (var key in row) {
        var number = parseFloat(row[key]);

        if (!Number.isNaN(number)) {
          row[key] = number;
        }
      }
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

  return csv;
}
//# sourceMappingURL=convert-json.js.map