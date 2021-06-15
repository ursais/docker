import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
export default function convertKeysToCamelCase(object) {
  if (object === null || object === undefined) {
    return object;
  }

  if (isPlainObject(object)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapKeys(object, (_, k) => camelCase(k));
  }

  throw new Error(`Cannot convert input that is not a plain object: ${object}`);
}