"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateFuncSignature = generateFuncSignature;
exports.generateShortFuncSignature = generateShortFuncSignature;
exports.toMultilineSignature = toMultilineSignature;

function generateFuncSignature(params, returns) {
  var hasParams = params != null;
  var hasReturns = returns != null;

  if (!hasParams && !hasReturns) {
    return '';
  }

  var funcParts = [];

  if (hasParams) {
    var funcParams = params.map(function (x) {
      var prettyName = x.getPrettyName();
      var typeName = x.getTypeName();

      if (typeName != null) {
        return "".concat(prettyName, ": ").concat(typeName);
      }

      return prettyName;
    });
    funcParts.push("(".concat(funcParams.join(', '), ")"));
  } else {
    funcParts.push('()');
  }

  if (hasReturns) {
    funcParts.push("=> ".concat(returns.getTypeName()));
  }

  return funcParts.join(' ');
}

function generateShortFuncSignature(params, returns) {
  var hasParams = params != null;
  var hasReturns = returns != null;

  if (!hasParams && !hasReturns) {
    return '';
  }

  var funcParts = [];

  if (hasParams) {
    funcParts.push('( ... )');
  } else {
    funcParts.push('()');
  }

  if (hasReturns) {
    funcParts.push("=> ".concat(returns.getTypeName()));
  }

  return funcParts.join(' ');
}

function toMultilineSignature(signature) {
  return signature.replace(/,/g, ',\r\n');
}