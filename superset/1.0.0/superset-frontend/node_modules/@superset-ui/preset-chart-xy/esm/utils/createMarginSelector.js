import { createSelector } from 'reselect';
export const DEFAULT_MARGIN = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16
};
export default function createMarginSelector(defaultMargin = DEFAULT_MARGIN) {
  return createSelector(margin => margin.bottom, margin => margin.left, margin => margin.right, margin => margin.top, (bottom = defaultMargin.bottom, left = defaultMargin.left, right = defaultMargin.right, top = defaultMargin.top) => ({
    bottom,
    left,
    right,
    top
  }));
}