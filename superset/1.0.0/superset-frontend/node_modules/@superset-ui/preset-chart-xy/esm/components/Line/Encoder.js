import createEncoderFactory from 'encodable/lib/encoders/createEncoderFactory';
export const lineEncoderFactory = createEncoderFactory({
  channelTypes: {
    x: 'X',
    y: 'Y',
    fill: 'Category',
    stroke: 'Color',
    strokeDasharray: 'Category',
    strokeWidth: 'Numeric'
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
      value: false,
      legend: false
    },
    stroke: {
      value: '#222'
    },
    strokeDasharray: {
      value: ''
    },
    strokeWidth: {
      value: 1
    }
  }
});