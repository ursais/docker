import _pt from "prop-types";
import React from 'react';
import ReactMarkdown from 'react-markdown'; // @ts-ignore no types available

import htmlParser from 'react-markdown/plugins/html-parser';
import { FeatureFlag, isFeatureEnabled } from '../utils';
import { jsx as ___EmotionJSX } from "@emotion/react";

function isSafeMarkup(node) {
  return node.type === 'html' && node.value ? /href="(javascript|vbscript|file):.*"/gim.test(node.value) === false : true;
}

function SafeMarkdown({
  source
}) {
  return ___EmotionJSX(ReactMarkdown, {
    source: source,
    escapeHtml: isFeatureEnabled(FeatureFlag.ESCAPE_MARKDOWN_HTML),
    skipHtml: !isFeatureEnabled(FeatureFlag.DISPLAY_MARKDOWN_HTML),
    allowNode: isSafeMarkup,
    astPlugins: [htmlParser({
      isValidNode: node => node.type !== 'script'
    })]
  });
}

SafeMarkdown.propTypes = {
  source: _pt.string.isRequired
};
export default SafeMarkdown;