import main from './solid-polygon-layer-vertex-main.glsl';
export default `\
#define SHADER_NAME solid-polygon-layer-vertex-shader-side
#define IS_SIDE_VERTEX


attribute vec3 instancePositions;
attribute vec2 instancePositions64xyLow;
attribute vec3 nextPositions;
attribute vec2 nextPositions64xyLow;
attribute float instanceElevations;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

${main}

void main(void) {
  PolygonProps props;

  props.positions = instancePositions;
  props.positions64xyLow = instancePositions64xyLow;
  props.elevations = instanceElevations;
  props.fillColors = instanceFillColors;
  props.lineColors = instanceLineColors;
  props.pickingColors = instancePickingColors;
  props.nextPositions = nextPositions;
  props.nextPositions64xyLow = nextPositions64xyLow;

  calculatePosition(props);
}
`;
//# sourceMappingURL=solid-polygon-layer-vertex-side.glsl.js.map