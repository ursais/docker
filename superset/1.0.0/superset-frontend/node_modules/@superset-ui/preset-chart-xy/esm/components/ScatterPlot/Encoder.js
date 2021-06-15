import { createEncoderFactory } from 'encodable';
export const scatterPlotEncoderFactory = createEncoderFactory({
  channelTypes: {
    x: 'X',
    y: 'Y',
    fill: 'Color',
    group: 'Category',
    size: 'Numeric',
    stroke: 'Color',
    tooltip: 'Text'
  },
  defaultEncoding: {
    x: {
      field: 'x',
      type: 'quantitative'
    },
    y: {
      field: 'y',
      type: 'quantitative'
    },
    fill: {
      value: '#222'
    },
    group: [],
    size: {
      value: 5
    },
    stroke: {
      value: 'none'
    },
    tooltip: []
  }
});