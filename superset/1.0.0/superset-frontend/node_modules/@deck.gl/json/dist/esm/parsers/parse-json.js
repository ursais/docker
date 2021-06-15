export default function parseJSON(json) {
  return typeof json === 'string' ? JSON.parse(json) : Object.assign({}, json);
}
//# sourceMappingURL=parse-json.js.map