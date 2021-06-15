import { Registry, makeSingleton, OverwritePolicy } from '../..';

class ChartTransformPropsRegistry extends Registry {
  constructor() {
    super({
      name: 'ChartTransformProps',
      overwritePolicy: OverwritePolicy.WARN
    });
  }

}

const getInstance = makeSingleton(ChartTransformPropsRegistry);
export default getInstance;