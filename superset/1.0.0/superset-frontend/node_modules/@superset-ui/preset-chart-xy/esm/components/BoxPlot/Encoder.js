import { createEncoderFactory } from 'encodable';
export const boxPlotEncoderFactory = createEncoderFactory({
  channelTypes: {
    x: 'XBand',
    y: 'YBand',
    color: 'Color'
  },
  defaultEncoding: {
    x: {
      field: 'x',
      type: 'nominal'
    },
    y: {
      field: 'y',
      type: 'quantitative'
    },
    color: {
      value: '#222'
    }
  }
});