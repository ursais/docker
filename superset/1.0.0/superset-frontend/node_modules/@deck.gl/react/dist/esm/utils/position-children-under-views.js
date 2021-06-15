import { createElement } from 'react';
import { View, log } from '@deck.gl/core';
import { inheritsFrom } from './inherits-from';
import evaluateChildren from './evaluate-children';
export default function positionChildrenUnderViews(_ref) {
  var children = _ref.children,
      viewports = _ref.viewports,
      deck = _ref.deck,
      ContextProvider = _ref.ContextProvider;

  var _ref2 = deck || {},
      viewManager = _ref2.viewManager;

  if (!viewManager || !viewManager.views.length) {
    return [];
  }

  var defaultViewId = viewManager.views[0].id;
  return children.map(function (child, i) {
    if (child.props.viewportId) {
      log.removed('viewportId', '<View>')();
    }

    if (child.props.viewId) {
      log.removed('viewId', '<View>')();
    }

    var viewId = defaultViewId;
    var viewChildren = child;

    if (inheritsFrom(child.type, View)) {
      viewId = child.props.id || defaultViewId;
      viewChildren = child.props.children;
    }

    var childStyle = viewChildren && viewChildren.props && viewChildren.props.style;
    var viewport = viewManager.getViewport(viewId);
    var viewState = viewManager.getViewState(viewId);

    if (!viewport) {
      return null;
    }

    var x = viewport.x,
        y = viewport.y,
        width = viewport.width,
        height = viewport.height;
    viewChildren = evaluateChildren(viewChildren, {
      x: x,
      y: y,
      width: width,
      height: height,
      viewport: viewport,
      viewState: viewState
    });
    var style = {
      position: 'absolute',
      zIndex: childStyle && childStyle.zIndex,
      pointerEvents: 'none',
      left: x,
      top: y,
      width: width,
      height: height
    };
    var key = "view-child-".concat(viewId, "-").concat(i);

    if (ContextProvider) {
      var contextValue = {
        viewport: viewport,
        container: deck.canvas.offsetParent,
        eventManager: deck.eventManager,
        onViewStateChange: deck._onViewStateChange
      };
      viewChildren = createElement(ContextProvider, {
        value: contextValue
      }, viewChildren);
    }

    return createElement('div', {
      key: key,
      id: key,
      style: style
    }, viewChildren);
  });
}
//# sourceMappingURL=position-children-under-views.js.map