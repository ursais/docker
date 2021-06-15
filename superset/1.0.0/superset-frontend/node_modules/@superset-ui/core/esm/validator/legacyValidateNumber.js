import { t } from '../translation';
/**
 * formerly called numeric()
 * @param v
 */

export default function numeric(v) {
  if (v && Number.isNaN(Number(v))) {
    return t('is expected to be a number');
  }

  return false;
}