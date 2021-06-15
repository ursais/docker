export default class Effect {
  constructor() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _props$id = props.id,
          id = _props$id === void 0 ? 'effect' : _props$id;
    this.id = id;
    this.props = {};
    Object.assign(this.props, props);
  }

  prepare() {}

  getParameters() {}

  cleanup() {}

}
//# sourceMappingURL=effect.js.map