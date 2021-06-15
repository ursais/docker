"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeScriptDefaults = void 0;
var typeScriptDefaults = {
  check: false,
  // 'react-docgen' faster but produces lower quality typescript results
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: {
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: function (prop) {
      return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true;
    }
  }
};
exports.typeScriptDefaults = typeScriptDefaults;