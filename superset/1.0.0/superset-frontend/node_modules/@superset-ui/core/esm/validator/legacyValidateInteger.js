import { t } from '../translation';
/**
 * formerly called integer()
 * @param v
 */

export default function legacyValidateInteger(v) {
  if (v && (Number.isNaN(Number(v)) || parseInt(v, 10) !== Number(v))) {
    return t('is expected to be an integer');
  }

  return false;
}