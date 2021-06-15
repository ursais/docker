import React from 'react';
import { jsx as ___EmotionJSX } from "@emotion/react";
const CONTAINER_STYLE = {
  backgroundColor: '#000',
  color: '#fff',
  overflow: 'auto',
  padding: 32
};
export default function FallbackComponent({
  componentStack,
  error,
  height,
  width
}) {
  return ___EmotionJSX("div", {
    style: { ...CONTAINER_STYLE,
      height,
      width
    }
  }, ___EmotionJSX("div", null, ___EmotionJSX("div", null, ___EmotionJSX("b", null, "Oops! An error occured!")), ___EmotionJSX("code", null, error ? error.toString() : 'Unknown Error')), componentStack && ___EmotionJSX("div", null, ___EmotionJSX("b", null, "Stack Trace:"), ___EmotionJSX("code", null, componentStack.split('\n').map(row => ___EmotionJSX("div", {
    key: row
  }, row)))));
}