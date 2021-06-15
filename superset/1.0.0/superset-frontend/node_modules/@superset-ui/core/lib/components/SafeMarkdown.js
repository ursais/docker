"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactMarkdown = _interopRequireDefault(require("react-markdown"));

var _htmlParser = _interopRequireDefault(require("react-markdown/plugins/html-parser"));

var _utils = require("../utils");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore no types available
function isSafeMarkup(node) {
  return node.type === 'html' && node.value ? /href="(javascript|vbscript|file):.*"/gim.test(node.value) === false : true;
}

function SafeMarkdown({
  source
}) {
  return (0, _react2.jsx)(_reactMarkdown.default, {
    source: source,
    escapeHtml: (0, _utils.isFeatureEnabled)(_utils.FeatureFlag.ESCAPE_MARKDOWN_HTML),
    skipHtml: !(0, _utils.isFeatureEnabled)(_utils.FeatureFlag.DISPLAY_MARKDOWN_HTML),
    allowNode: isSafeMarkup,
    astPlugins: [(0, _htmlParser.default)({
      isValidNode: node => node.type !== 'script'
    })]
  });
}

SafeMarkdown.propTypes = {
  source: _propTypes.default.string.isRequired
};
var _default = SafeMarkdown;
exports.default = _default;