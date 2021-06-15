export function isObjectEmpty(object) {
  for (const key in object) {
    return false;
  }

  return true;
}
export function isWebGL2(gl) {
  return Boolean(gl && gl._version === 2);
}
//# sourceMappingURL=utils.js.map