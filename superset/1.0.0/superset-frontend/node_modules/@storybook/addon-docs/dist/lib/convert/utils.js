"use strict";

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trimQuotes = void 0;
var QUOTE_REGEX = /^['"]|['"]$/g;

var trimQuotes = function trimQuotes(str) {
  return str.replace(QUOTE_REGEX, '');
};

exports.trimQuotes = trimQuotes;