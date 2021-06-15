"use strict";

exports.__esModule = true;
exports.default = createXYChartLayoutWithTheme;

var _XYChartLayout = _interopRequireDefault(require("./XYChartLayout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createXYChartLayoutWithTheme(config) {
  const {
    theme,
    ...rest
  } = config;
  return new _XYChartLayout.default({ ...rest,
    // @ts-ignore
    xTickSize: theme.xTickStyles.length || theme.xTickStyles.tickLength,
    xTickTextStyle: theme.xTickStyles.label.bottom || theme.xTickStyles.label.top,
    // @ts-ignore
    yTickSize: theme.yTickStyles.length || theme.yTickStyles.tickLength,
    yTickTextStyle: theme.yTickStyles.label.left || theme.yTickStyles.label.right
  });
}