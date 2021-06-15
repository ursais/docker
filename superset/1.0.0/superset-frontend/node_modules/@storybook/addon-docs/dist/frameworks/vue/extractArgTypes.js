"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractArgTypes = void 0;

var _docgen = require("../../lib/docgen");

var _convert = require("../../lib/convert");

var _utils = require("../../lib/convert/utils");

var SECTIONS = ['props', 'events', 'slots'];

var trim = function trim(val) {
  return val && typeof val === 'string' ? (0, _utils.trimQuotes)(val) : val;
};

var extractArgTypes = function extractArgTypes(component) {
  if (!(0, _docgen.hasDocgen)(component)) {
    return null;
  }

  var results = {};
  SECTIONS.forEach(function (section) {
    var props = (0, _docgen.extractComponentProps)(component, section);
    props.forEach(function (_ref) {
      var propDef = _ref.propDef,
          docgenInfo = _ref.docgenInfo,
          jsDocTags = _ref.jsDocTags;
      var name = propDef.name,
          type = propDef.type,
          description = propDef.description,
          defaultSummary = propDef.defaultValue,
          required = propDef.required;
      var sbType = section === 'props' ? (0, _convert.convert)(docgenInfo) : {
        name: 'void'
      };
      var defaultValue = defaultSummary && (defaultSummary.detail || defaultSummary.summary);

      try {
        // eslint-disable-next-line no-eval
        defaultValue = eval(defaultValue); // eslint-disable-next-line no-empty
      } catch (_unused) {}

      results[name] = {
        name: name,
        description: description,
        type: Object.assign({
          required: required
        }, sbType),
        defaultValue: defaultValue,
        table: {
          type: type,
          jsDocTags: jsDocTags,
          defaultValue: defaultSummary,
          category: section
        }
      };
    });
  });
  return results;
};

exports.extractArgTypes = extractArgTypes;