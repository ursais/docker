import _pt from "prop-types";
import React, { PureComponent } from 'react';
import { isDefined } from '../utils';
import { jsx as ___EmotionJSX } from "@emotion/react";

function checkNumber(input) {
  return isDefined(input) && typeof input === 'number';
}

export default class ChartFrame extends PureComponent {
  render() {
    const {
      contentWidth,
      contentHeight,
      width,
      height,
      renderContent
    } = this.props;
    const overflowX = checkNumber(contentWidth) && contentWidth > width;
    const overflowY = checkNumber(contentHeight) && contentHeight > height;

    if (overflowX || overflowY) {
      return ___EmotionJSX("div", {
        style: {
          height,
          overflowX: overflowX ? 'auto' : 'hidden',
          overflowY: overflowY ? 'auto' : 'hidden',
          width
        }
      }, renderContent({
        height: Math.max(contentHeight != null ? contentHeight : 0, height),
        width: Math.max(contentWidth != null ? contentWidth : 0, width)
      }));
    }

    return renderContent({
      height,
      width
    });
  }

}
ChartFrame.propTypes = {
  contentWidth: _pt.number,
  contentHeight: _pt.number,
  height: _pt.number.isRequired,
  renderContent: _pt.func.isRequired,
  width: _pt.number.isRequired
};
ChartFrame.defaultProps = {
  renderContent() {}

};