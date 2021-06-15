import { Registry, makeSingleton, OverwritePolicy } from '../..'; // Ideally this would be <T extends QueryFormData>

class ChartBuildQueryRegistry extends Registry {
  constructor() {
    super({
      name: 'ChartBuildQuery',
      overwritePolicy: OverwritePolicy.WARN
    });
  }

}

const getInstance = makeSingleton(ChartBuildQueryRegistry);
export default getInstance;