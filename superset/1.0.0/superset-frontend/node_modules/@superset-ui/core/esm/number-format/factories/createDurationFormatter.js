import prettyMsFormatter from 'pretty-ms';
import NumberFormatter from '../NumberFormatter';
export default function createDurationFormatter(config = {}) {
  const {
    description,
    id,
    label,
    multiplier = 1,
    ...prettyMsOptions
  } = config;
  return new NumberFormatter({
    description,
    formatFunc: value => prettyMsFormatter(value * multiplier, prettyMsOptions),
    id: id != null ? id : 'duration_format',
    label: label != null ? label : `Duration formatter`
  });
}