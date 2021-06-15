export default function stringifyTimeInput(value, fn) {
  if (value === null || value === undefined) {
    return `${value}`;
  }

  return fn(value instanceof Date ? value : new Date(value));
}