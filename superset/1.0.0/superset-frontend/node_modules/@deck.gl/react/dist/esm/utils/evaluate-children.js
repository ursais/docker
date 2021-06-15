import { cloneElement } from 'react';
export default function evaluateChildren(children, childProps) {
  if (!children) {
    return children;
  }

  if (typeof children === 'function') {
    return children(childProps);
  }

  if (Array.isArray(children)) {
    return children.map(function (child) {
      return evaluateChildren(child, childProps);
    });
  }

  return cloneElement(children, childProps);
}
//# sourceMappingURL=evaluate-children.js.map