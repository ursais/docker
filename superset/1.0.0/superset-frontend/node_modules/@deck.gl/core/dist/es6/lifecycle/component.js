import { LIFECYCLE } from '../lifecycle/constants';
import { createProps } from '../lifecycle/create-props';
import ComponentState from './component-state';
const defaultProps = {};
let counter = 0;
export default class Component {
  constructor() {
    this.props = createProps.apply(this, arguments);
    this.id = this.props.id;
    this.count = counter++;
    this.lifecycle = LIFECYCLE.NO_STATE;
    this.parent = null;
    this.context = null;
    this.state = null;
    this.internalState = null;
    Object.seal(this);
  }

  clone(newProps) {
    const props = this.props;
    const asyncProps = {};

    for (const key in props._asyncPropDefaultValues) {
      if (key in props._asyncPropResolvedValues) {
        asyncProps[key] = props._asyncPropResolvedValues[key];
      } else if (key in props._asyncPropOriginalValues) {
        asyncProps[key] = props._asyncPropOriginalValues[key];
      }
    }

    return new this.constructor(Object.assign({}, props, asyncProps, newProps));
  }

  get stats() {
    return this.internalState.stats;
  }

  _initState() {
    this.internalState = new ComponentState({});
  }

}
Component.componentName = 'Component';
Component.defaultProps = defaultProps;
//# sourceMappingURL=component.js.map