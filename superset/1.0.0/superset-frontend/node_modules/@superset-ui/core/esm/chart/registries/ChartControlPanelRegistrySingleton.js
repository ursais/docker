import { Registry, makeSingleton } from '../..';

class ChartControlPanelRegistry extends Registry {
  constructor() {
    super({
      name: 'ChartControlPanel'
    });
  }

}

const getInstance = makeSingleton(ChartControlPanelRegistry);
export default getInstance;