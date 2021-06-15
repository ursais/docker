import { RegistryWithDefaultKey, OverwritePolicy } from '../models';
export default class ColorSchemeRegistry extends RegistryWithDefaultKey {
  constructor() {
    super({
      name: 'ColorScheme',
      overwritePolicy: OverwritePolicy.WARN,
      setFirstItemAsDefault: true
    });
  }

  get(key) {
    return super.get(key);
  }

}