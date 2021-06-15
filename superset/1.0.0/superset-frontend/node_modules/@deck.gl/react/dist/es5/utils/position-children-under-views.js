"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = positionChildrenUnderViews;

var _react = require("react");

var _core = require("@deck.gl/core");

var _inheritsFrom = require("./inherits-from");

var _evaluateChildren = _interopRequireDefault(require("./evaluate-children"));

function positionChildrenUnderViews(_ref) {
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
      _core.log.removed('viewportId', '<View>')();
    }

    if (child.props.viewId) {
      _core.log.removed('viewId', '<View>')();
    }

    var viewId = defaultViewId;
    var viewChildren = child;

    if ((0, _inheritsFrom.inheritsFrom)(child.type, _core.View)) {
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
    viewChildren = (0, _evaluateChildren.default)(viewChildren, {
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
      viewChildren = (0, _react.createElement)(ContextProvider, {
        value: contextValue
      }, viewChildren);
    }

    return (0, _react.createElement)('div', {
      key: key,
      id: key,
      style: style
    }, viewChildren);
  });
}
//# sourceMappingURL=position-children-under-views.js.map