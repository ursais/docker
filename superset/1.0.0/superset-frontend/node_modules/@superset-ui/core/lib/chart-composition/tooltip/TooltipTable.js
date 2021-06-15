"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  className: '',
  data: []
};
const VALUE_CELL_STYLE = {
  paddingLeft: 8,
  textAlign: 'right'
};

class TooltipTable extends _react.PureComponent {
  render() {
    const {
      className,
      data
    } = this.props;
    return (0, _react2.jsx)("table", {
      className: className
    }, (0, _react2.jsx)("tbody", null, data.map(({
      key,
      keyColumn,
      keyStyle,
      valueColumn,
      valueStyle
    }) => (0, _react2.jsx)("tr", {
      key: key
    }, (0, _react2.jsx)("td", {
      style: keyStyle
    }, keyColumn != null ? keyColumn : key), (0, _react2.jsx)("td", {
      style: valueStyle ? { ...VALUE_CELL_STYLE,
        ...valueStyle
      } : VALUE_CELL_STYLE
    }, valueColumn)))));
  }

}

exports.default = TooltipTable;
TooltipTable.propTypes = {
  className: _propTypes.default.string,
  data: _propTypes.default.arrayOf(_propTypes.default.shape({
    key: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
    keyColumn: _propTypes.default.node,
    valueColumn: _propTypes.default.node.isRequired
  })).isRequired
};
TooltipTable.defaultProps = defaultProps;