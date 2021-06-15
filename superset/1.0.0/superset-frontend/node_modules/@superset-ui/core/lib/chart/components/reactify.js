"use strict";

exports.__esModule = true;
exports.default = reactify;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reactify(renderFn, callbacks) {
  class ReactifiedComponent extends _react.default.Component {
    constructor(props) {
      super(props);
      this.container = void 0;
      this.setContainerRef = this.setContainerRef.bind(this);
    }

    componentDidMount() {
      this.execute();
    }

    componentDidUpdate() {
      this.execute();
    }

    componentWillUnmount() {
      this.container = undefined;

      if (callbacks != null && callbacks.componentWillUnmount) {
        callbacks.componentWillUnmount.bind(this)();
      }
    }

    setContainerRef(ref) {
      this.container = ref;
    }

    execute() {
      if (this.container) {
        renderFn(this.container, this.props);
      }
    }

    render() {
      const {
        id,
        className
      } = this.props;
      return (0, _react2.jsx)("div", {
        ref: this.setContainerRef,
        id: id,
        className: className
      });
    }

  }

  ReactifiedComponent.propTypes = {
    id: _propTypes.default.string,
    className: _propTypes.default.string
  };
  const ReactifiedClass = ReactifiedComponent;

  if (renderFn.displayName) {
    ReactifiedClass.displayName = renderFn.displayName;
  } // eslint-disable-next-line react/forbid-foreign-prop-types


  if (renderFn.propTypes) {
    ReactifiedClass.propTypes = { ...ReactifiedClass.propTypes,
      ...renderFn.propTypes
    };
  }

  if (renderFn.defaultProps) {
    ReactifiedClass.defaultProps = renderFn.defaultProps;
  }

  return ReactifiedComponent;
}