import Registry from './Registry';
export default class RegistryWithDefaultKey extends Registry {
  constructor(config = {}) {
    super(config);
    this.initialDefaultKey = void 0;
    this.defaultKey = void 0;
    this.setFirstItemAsDefault = void 0;
    const {
      initialDefaultKey = undefined,
      setFirstItemAsDefault = false
    } = config;
    this.initialDefaultKey = initialDefaultKey;
    this.defaultKey = initialDefaultKey;
    this.setFirstItemAsDefault = setFirstItemAsDefault;
  }

  clear() {
    super.clear();
    this.defaultKey = this.initialDefaultKey;
    return this;
  }

  get(key) {
    const targetKey = key != null ? key : this.defaultKey;
    return targetKey ? super.get(targetKey) : undefined;
  }

  registerValue(key, value) {
    super.registerValue(key, value); // If there is no default, set as default

    if (this.setFirstItemAsDefault && !this.defaultKey) {
      this.defaultKey = key;
    }

    return this;
  }

  registerLoader(key, loader) {
    super.registerLoader(key, loader); // If there is no default, set as default

    if (this.setFirstItemAsDefault && !this.defaultKey) {
      this.defaultKey = key;
    }

    return this;
  }

  getDefaultKey() {
    return this.defaultKey;
  }

  setDefaultKey(key) {
    this.defaultKey = key;
    return this;
  }

  clearDefaultKey() {
    this.defaultKey = undefined;
    return this;
  }

}