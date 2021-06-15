import XYChartLayout from './XYChartLayout';
export default function createXYChartLayoutWithTheme(config) {
  const {
    theme,
    ...rest
  } = config;
  return new XYChartLayout({ ...rest,
    // @ts-ignore
    xTickSize: theme.xTickStyles.length || theme.xTickStyles.tickLength,
    xTickTextStyle: theme.xTickStyles.label.bottom || theme.xTickStyles.label.top,
    // @ts-ignore
    yTickSize: theme.yTickStyles.length || theme.yTickStyles.tickLength,
    yTickTextStyle: theme.yTickStyles.label.left || theme.yTickStyles.label.right
  });
}