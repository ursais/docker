(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("deck"));
	else if(typeof define === 'function' && define.amd)
		define(["deck"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("deck")) : factory(root["deck"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__deck_gl_core__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/d3-dsv/src/csv.js":
/*!*********************************************************************!*\
  !*** /Users/missx/Documents/deck.gl/node_modules/d3-dsv/src/csv.js ***!
  \*********************************************************************/
/*! exports provided: csvParse, csvParseRows, csvFormat, csvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvParse", function() { return csvParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvParseRows", function() { return csvParseRows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvFormat", function() { return csvFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvFormatRows", function() { return csvFormatRows; });
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "../../node_modules/d3-dsv/src/dsv.js");


var csv = Object(_dsv__WEBPACK_IMPORTED_MODULE_0__["default"])(",");

var csvParse = csv.parse;
var csvParseRows = csv.parseRows;
var csvFormat = csv.format;
var csvFormatRows = csv.formatRows;


/***/ }),

/***/ "../../node_modules/d3-dsv/src/dsv.js":
/*!*********************************************************************!*\
  !*** /Users/missx/Documents/deck.gl/node_modules/d3-dsv/src/dsv.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

/* harmony default export */ __webpack_exports__["default"] = (function(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // current line number
        t, // current token
        eof = N <= 0, // current token followed by EOF?
        eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i, j = I, c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return text == null ? ""
        : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\""
        : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
});


/***/ }),

/***/ "../../node_modules/d3-dsv/src/index.js":
/*!***********************************************************************!*\
  !*** /Users/missx/Documents/deck.gl/node_modules/d3-dsv/src/index.js ***!
  \***********************************************************************/
/*! exports provided: dsvFormat, csvParse, csvParseRows, csvFormat, csvFormatRows, tsvParse, tsvParseRows, tsvFormat, tsvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "../../node_modules/d3-dsv/src/dsv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dsvFormat", function() { return _dsv__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _csv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./csv */ "../../node_modules/d3-dsv/src/csv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvParse", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvParse"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvParseRows", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvParseRows"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvFormat", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvFormatRows", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvFormatRows"]; });

/* harmony import */ var _tsv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tsv */ "../../node_modules/d3-dsv/src/tsv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvParse", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvParse"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvParseRows", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvParseRows"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvFormat", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvFormatRows", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvFormatRows"]; });






/***/ }),

/***/ "../../node_modules/d3-dsv/src/tsv.js":
/*!*********************************************************************!*\
  !*** /Users/missx/Documents/deck.gl/node_modules/d3-dsv/src/tsv.js ***!
  \*********************************************************************/
/*! exports provided: tsvParse, tsvParseRows, tsvFormat, tsvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvParse", function() { return tsvParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvParseRows", function() { return tsvParseRows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvFormat", function() { return tsvFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvFormatRows", function() { return tsvFormatRows; });
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "../../node_modules/d3-dsv/src/dsv.js");


var tsv = Object(_dsv__WEBPACK_IMPORTED_MODULE_0__["default"])("\t");

var tsvParse = tsv.parse;
var tsvParseRows = tsv.parseRows;
var tsvFormat = tsv.format;
var tsvFormatRows = tsv.formatRows;


/***/ }),

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./bundle.js":
/*!*******************!*\
  !*** ./bundle.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const JSONUtils = __webpack_require__(/*! ./src */ "./src/index.js");

/* global window, global */
const _global = typeof window === 'undefined' ? global : window;
const deck = _global.deck || {};

// Check if peer dependencies are included
if (!deck.Layer) {
  throw new Error('@deck.gl/core is not found');
}

module.exports = Object.assign(deck, JSONUtils);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: _JSONConverter, _JSONLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _json_converter_json_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./json-converter/json-converter */ "./src/json-converter/json-converter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_JSONConverter", function() { return _json_converter_json_converter__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _json_layer_json_layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./json-layer/json-layer */ "./src/json-layer/json-layer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_JSONLayer", function() { return _json_layer_json_layer__WEBPACK_IMPORTED_MODULE_1__["default"]; });

//
// @deck.gl/json: top-level exports
//





/***/ }),

/***/ "./src/json-converter/json-converter.js":
/*!**********************************************!*\
  !*** ./src/json-converter/json-converter.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return JSONConverter; });
/* harmony import */ var _utils_shallow_equal_objects_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/shallow-equal-objects.js */ "./src/utils/shallow-equal-objects.js");
/* harmony import */ var _parsers_parse_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parsers/parse-json */ "./src/parsers/parse-json.js");
/* harmony import */ var _parsers_convert_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parsers/convert-json */ "./src/parsers/convert-json.js");
// Converts JSON to props ("hydrating" classes, resolving enums and functions etc).
// TODO - Currently converts in place, might be clearer to convert to separate structure





class JSONConverter {
  constructor(props) {
    this.configuration = {};
    this.onJSONChange = () => {};
    // this._onViewStateChange = this._onViewStateChange.bind(this);
    this.setProps(props);
  }

  finalize() {}

  setProps(props) {
    // HANDLE CONFIGURATION PROPS
    if ('configuration' in props) {
      this.configuration = props.configuration;
    }

    if ('onJSONChange' in props) {
      this.onJSONChange = props.onJSONChange;
    }
  }

  convertJsonToDeckProps(json) {
    // Use shallow equality to Ensure we only convert once
    if (!json || json === this.json) {
      return this.deckProps;
    }
    this.json = json;

    // Accept JSON strings by parsing them
    const parsedJSON = Object(_parsers_parse_json__WEBPACK_IMPORTED_MODULE_1__["default"])(json);

    // Convert the JSON
    const jsonProps = Object(_parsers_convert_json__WEBPACK_IMPORTED_MODULE_2__["convertTopLevelJSON"])(parsedJSON, this.configuration);

    // Handle `json.initialViewState`
    // If we receive new JSON we need to decide if we should update current view state
    // Current heuristic is to compare with last `initialViewState` and only update if changed
    if ('initialViewState' in jsonProps) {
      const updateViewState =
        !this.initialViewState ||
        !Object(_utils_shallow_equal_objects_js__WEBPACK_IMPORTED_MODULE_0__["shallowEqualObjects"])(jsonProps.initialViewState, this.initialViewState);

      if (updateViewState) {
        jsonProps.viewState = jsonProps.initialViewState;
        this.initialViewState = jsonProps.initialViewState;
      }

      delete jsonProps.initialViewState;
    }

    this.deckProps = jsonProps;
    return jsonProps;
  }
}


/***/ }),

/***/ "./src/json-layer/json-layer.js":
/*!**************************************!*\
  !*** ./src/json-layer/json-layer.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return JSONLayer; });
/* harmony import */ var _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @deck.gl/core */ "@deck.gl/core");
/* harmony import */ var _deck_gl_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deck_gl_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _parsers_convert_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parsers/convert-json */ "./src/parsers/convert-json.js");



const defaultProps = {
  // Optionally accept JSON strings by parsing them
  fetch: dataString => JSON.parse(dataString),
  configuration: []
};

class JSONLayer extends _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__["CompositeLayer"] {
  initializeState() {
    this.state = {
      layers: []
    };
  }

  updateState({props, oldProps, changeFlags}) {
    const layersChanged = changeFlags.dataChanged || props.configuration !== oldProps.configuration;

    if (layersChanged) {
      this.state.layers = Object(_parsers_convert_json__WEBPACK_IMPORTED_MODULE_1__["getJSONLayers"])(props.data, props.configuration);
    }
  }

  renderLayers() {
    return this.state.layers;
  }
}

JSONLayer.layerName = 'JSONLayer';
JSONLayer.defaultProps = defaultProps;


/***/ }),

/***/ "./src/parsers/convert-json.js":
/*!*************************************!*\
  !*** ./src/parsers/convert-json.js ***!
  \*************************************/
/*! exports provided: convertTopLevelJSON, getJSONLayers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertTopLevelJSON", function() { return convertTopLevelJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getJSONLayers", function() { return getJSONLayers; });
/* harmony import */ var _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @deck.gl/core */ "@deck.gl/core");
/* harmony import */ var _deck_gl_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deck_gl_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _json_layer_json_layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../json-layer/json-layer */ "./src/json-layer/json-layer.js");
/* harmony import */ var _utils_get__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/get */ "./src/utils/get.js");
/* harmony import */ var d3_dsv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! d3-dsv */ "../../node_modules/d3-dsv/src/index.js");
// Converts a JSON payload to a deck.gl props object
// Lightly processes `json` props, transform string values, and extract `views` and `layers`
// See: https://github.com/uber/deck.gl/blob/master/dev-docs/RFCs/v6.1/json-layers-rfc.md
//
// NOTES:
// * This is intended to provide minimal necessary processing required to support
//   existing deck.gl props via JSON. This is not an implementation of alternate JSON schemas.
// * Optionally, error checking could be applied, but ideally should leverage
//   non-JSON specific mechanisms like prop types.






// Support all `@deck.gl/core` Views by default
const DEFAULT_VIEW_CATALOG = {MapView: _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__["MapView"], FirstPersonView: _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__["FirstPersonView"], OrbitView: _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__["OrbitView"], OrthographicView: _deck_gl_core__WEBPACK_IMPORTED_MODULE_0__["OrthographicView"]};

const DEFAULT_MAP_PROPS = {
  style: 'mapbox://styles/mapbox/light-v9'
};

// Converts JSON to props ("hydrating" classes, resolving enums and functions etc).
function convertTopLevelJSON(json, configuration) {
  // TODO - Currently converts "in place", might be clearer to convert to separate structure
  const jsonProps = json;

  // Convert "JSON layers" in `json.layers` into class instances
  if (jsonProps.layers) {
    jsonProps.layers = convertJSONLayers(json.layers, configuration);
  }

  // Convert "JSON views" in `json.views` into class instances
  if (jsonProps.views) {
    jsonProps.views = convertJSONViews(json.views, configuration);
  }

  if ('initialViewState' in jsonProps) {
    jsonProps.viewState = jsonProps.viewState || jsonProps.initialViewState;
  }

  convertJSONMapProps(jsonProps, configuration);

  return jsonProps;
}

// Normalizes map/mapStyle etc props to a `map: {style}` object-valued prop
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

  // TODO - better map handling
  if ('viewState' in jsonProps) {
    jsonProps.map.viewState = jsonProps.viewState;
  }
}

// Use the composite JSONLayer to render any JSON layers
function convertJSONLayers(jsonLayers, configuration) {
  return [
    new _json_layer_json_layer__WEBPACK_IMPORTED_MODULE_1__["default"]({
      data: jsonLayers,
      configuration
    })
  ];
}

// Instantiates views: `{type: MapView, ...props}` to `MapView(...props)`
function convertJSONViews(jsonViews, configuration) {
  if (!jsonViews) {
    return jsonViews;
  }

  const viewCatalog = configuration.views || {};

  jsonViews = Array.isArray(jsonViews) ? jsonViews : [jsonViews];
  return jsonViews
    .map(jsonView => {
      // Try to find a view definition
      const View = viewCatalog[jsonView.type] || DEFAULT_VIEW_CATALOG[jsonView.type];
      // Instantiate it
      if (View) {
        const viewProps = Object.assign({}, jsonView);
        delete viewProps.type;
        return new View(viewProps);
      }
      return null;
    })
    .filter(Boolean);
}

// LAYERS

// Replaces accessor props
function getJSONLayers(jsonLayers = [], configuration) {
  // assert(Array.isArray(jsonLayers));
  const layerCatalog = configuration.layers || {};
  return jsonLayers.map(jsonLayer => {
    const Layer = layerCatalog[jsonLayer.type];
    const props = getJSONLayerProps(jsonLayer, configuration);
    props.fetch = enhancedFetch;
    return Layer && new Layer(props);
  });
}

function getJSONLayerProps(jsonProps, configuration) {
  const replacedProps = {};
  for (const propName in jsonProps) {
    // eslint-disable-line guard-for-in
    const propValue = jsonProps[propName];
    // Handle accessors
    if (propName.startsWith('get')) {
      replacedProps[propName] = getJSONAccessor(propValue, configuration);
    } else {
      replacedProps[propName] = propValue;
    }
  }
  return replacedProps;
}

// Calculates an accessor function from a JSON string
// '-' : x => x
// 'a.b.c': x => x.a.b.c
function getJSONAccessor(propValue, configuration) {
  if (propValue === '-') {
    return object => object;
  }
  if (typeof propValue === 'string') {
    return object => {
      return Object(_utils_get__WEBPACK_IMPORTED_MODULE_2__["get"])(object, propValue);
    };
  }
  return propValue;
}

// HELPERS

function enhancedFetch(url) {
  /* global fetch */
  return fetch(url)
    .then(response => response.text())
    .then(text => {
      try {
        return JSON.parse(text);
      } catch (error) {
        return parseCSV(text);
      }
    });
}

function parseCSV(text) {
  const csv = Object(d3_dsv__WEBPACK_IMPORTED_MODULE_3__["csvParseRows"])(text);

  // Remove header
  if (csv.length > 0) {
    csv.shift();
  }

  for (const row of csv) {
    for (const key in row) {
      const number = parseFloat(row[key]);
      if (!Number.isNaN(number)) {
        row[key] = number;
      }
    }
  }

  return csv;
}


/***/ }),

/***/ "./src/parsers/parse-json.js":
/*!***********************************!*\
  !*** ./src/parsers/parse-json.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return parseJSON; });
// Accept JSON strings by parsing them
// Returns a fresh object that can be modified.
// TODO - use a parser that provides meaninful error messages
function parseJSON(json) {
  return typeof json === 'string' ? JSON.parse(json) : Object.assign({}, json);
}


/***/ }),

/***/ "./src/utils/get.js":
/*!**************************!*\
  !*** ./src/utils/get.js ***!
  \**************************/
/*! exports provided: get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Access properties of nested containers using dot-path notation
 * Returns `undefined` if any container is not valid, instead of throwing
 * @param {Object} container - container that supports get
 * @param {String|*} compositeKey - key to access, can be '.'-separated string
 * @return {*} - value in the final key of the nested container, or `undefined`
 */
function get(container, compositeKey) {
  // Split the key into subkeys
  const keyList = getKeys(compositeKey);
  // Recursively get the value of each key;
  let value = container;
  for (const key of keyList) {
    // If any intermediate subfield is not an object, return undefined
    value = isObject(value) ? value[key] : undefined;
  }
  return value;
}

/**
 * Checks if argument is an "indexable" object (not a primitive value, nor null)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a JavaScript object
 */
function isObject(value) {
  return value !== null && typeof value === 'object';
}

// Cache key to key arrays for speed
const keyMap = {};

// Takes a string of '.' separated keys and returns an array of keys
// - 'feature.geometry.type' => ['feature', 'geometry', 'type']
// - 'feature' => ['feature']
function getKeys(compositeKey) {
  if (typeof compositeKey === 'string') {
    // else assume string and split around dots
    let keyList = keyMap[compositeKey];
    if (!keyList) {
      keyList = compositeKey.split('.');
      keyMap[compositeKey] = keyList;
    }
    return keyList;
  }
  // Wrap in array if needed
  return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
}


/***/ }),

/***/ "./src/utils/shallow-equal-objects.js":
/*!********************************************!*\
  !*** ./src/utils/shallow-equal-objects.js ***!
  \********************************************/
/*! exports provided: shallowEqualObjects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowEqualObjects", function() { return shallowEqualObjects; });
// TODO - can we reuse the core util? Assuming we don't want to export it

/* eslint-disable complexity */

// Compares two objects to see if their keys are shallowly equal
function shallowEqualObjects(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (const key in b) {
    if (!(key in a)) {
      return false;
    }
  }
  return true;
}


/***/ }),

/***/ "@deck.gl/core":
/*!***********************!*\
  !*** external "deck" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__deck_gl_core__;

/***/ })

/******/ });
});