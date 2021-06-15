import { Registry, makeSingleton, OverwritePolicy } from '../..';

class ChartComponentRegistry extends Registry {
  constructor() {
    super({
      name: 'ChartComponent',
      overwritePolicy: OverwritePolicy.WARN
    });
  }

}

const getInstance = makeSingleton(ChartComponentRegistry);
export default getInstance;