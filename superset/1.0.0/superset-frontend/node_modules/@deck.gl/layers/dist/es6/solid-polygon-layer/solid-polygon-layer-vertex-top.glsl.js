import main from './solid-polygon-layer-vertex-main.glsl';
export default `\
#define SHADER_NAME solid-polygon-layer-vertex-shader

attribute vec3 positions;
attribute vec2 positions64xyLow;
attribute float elevations;
attribute vec4 fillColors;
attribute vec4 lineColors;
attribute vec3 pickingColors;

${main}

void main(void) {
  PolygonProps props;

  props.positions = positions;
  props.positions64xyLow = positions64xyLow;
  props.elevations = elevations;
  props.fillColors = fillColors;
  props.lineColors = lineColors;
  props.pickingColors = pickingColors;

  calculatePosition(props);
}
`;
//# sourceMappingURL=solid-polygon-layer-vertex-top.glsl.js.map