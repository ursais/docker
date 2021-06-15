import _pt from "prop-types";
import React, { PureComponent } from 'react';
import { jsx as ___EmotionJSX } from "@emotion/react";
const defaultProps = {
  className: ''
};
const CONTAINER_STYLE = {
  padding: 8
};

class TooltipFrame extends PureComponent {
  render() {
    const {
      className,
      children
    } = this.props;
    return ___EmotionJSX("div", {
      className: className,
      style: CONTAINER_STYLE
    }, children);
  }

}

TooltipFrame.propTypes = {
  className: _pt.string,
  children: _pt.node.isRequired
};
TooltipFrame.defaultProps = defaultProps;
export default TooltipFrame;