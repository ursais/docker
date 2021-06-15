import { ArcLayer } from '@deck.gl/layers';
import vs from './great-circle-vertex.glsl';
export default class GreatCircleLayer extends ArcLayer {
  getShaders() {
    const shaders = Object.assign({}, super.getShaders(), {
      vs,
      modules: ['picking', 'project32']
    });
    return shaders;
  }

}
GreatCircleLayer.layerName = 'GreatCircleLayer';
//# sourceMappingURL=great-circle-layer.js.map