import CategoricalColorScale from './CategoricalColorScale';
import getCategoricalSchemeRegistry from './CategoricalSchemeRegistrySingleton';
import stringifyAndTrim from './stringifyAndTrim';
export default class CategoricalColorNamespace {
  constructor(name) {
    this.name = void 0;
    this.forcedItems = void 0;
    this.scales = void 0;
    this.name = name;
    this.scales = {};
    this.forcedItems = {};
  }

  getScale(schemeId) {
    var _ref, _scheme$colors;

    const id = (_ref = schemeId != null ? schemeId : getCategoricalSchemeRegistry().getDefaultKey()) != null ? _ref : '';
    const scale = this.scales[id];

    if (scale) {
      return scale;
    }

    const scheme = getCategoricalSchemeRegistry().get(id);
    const newScale = new CategoricalColorScale((_scheme$colors = scheme == null ? void 0 : scheme.colors) != null ? _scheme$colors : [], this.forcedItems);
    this.scales[id] = newScale;
    return newScale;
  }
  /**
   * Enforce specific color for given value
   * This will apply across all color scales
   * in this namespace.
   * @param {*} value value
   * @param {*} forcedColor color
   */


  setColor(value, forcedColor) {
    this.forcedItems[stringifyAndTrim(value)] = forcedColor;
    return this;
  }

}
const namespaces = {};
export const DEFAULT_NAMESPACE = 'GLOBAL';
export function getNamespace(name = DEFAULT_NAMESPACE) {
  const instance = namespaces[name];

  if (instance) {
    return instance;
  }

  const newInstance = new CategoricalColorNamespace(name);
  namespaces[name] = newInstance;
  return newInstance;
}
export function getColor(value, schemeId, namespace) {
  return getNamespace(namespace).getScale(schemeId).getColor(value);
}
export function getScale(scheme, namespace) {
  return getNamespace(namespace).getScale(scheme);
}