import _pt from "prop-types";
import React, { PureComponent } from 'react';
import { jsx as ___EmotionJSX } from "@emotion/react";
const defaultProps = {
  className: '',
  data: []
};
const VALUE_CELL_STYLE = {
  paddingLeft: 8,
  textAlign: 'right'
};
export default class TooltipTable extends PureComponent {
  render() {
    const {
      className,
      data
    } = this.props;
    return ___EmotionJSX("table", {
      className: className
    }, ___EmotionJSX("tbody", null, data.map(({
      key,
      keyColumn,
      keyStyle,
      valueColumn,
      valueStyle
    }) => ___EmotionJSX("tr", {
      key: key
    }, ___EmotionJSX("td", {
      style: keyStyle
    }, keyColumn != null ? keyColumn : key), ___EmotionJSX("td", {
      style: valueStyle ? { ...VALUE_CELL_STYLE,
        ...valueStyle
      } : VALUE_CELL_STYLE
    }, valueColumn)))));
  }

}
TooltipTable.propTypes = {
  className: _pt.string,
  data: _pt.arrayOf(_pt.shape({
    key: _pt.oneOfType([_pt.string, _pt.number]).isRequired,
    keyColumn: _pt.node,
    valueColumn: _pt.node.isRequired
  })).isRequired
};
TooltipTable.defaultProps = defaultProps;