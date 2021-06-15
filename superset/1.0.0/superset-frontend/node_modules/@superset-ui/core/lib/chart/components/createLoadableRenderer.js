"use strict";

exports.__esModule = true;
exports.default = createLoadableRenderer;

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  onRenderFailure() {},

  onRenderSuccess() {}

};

function createLoadableRenderer(options) {
  const LoadableRenderer = _reactLoadable.default.Map(options); // Extends the behavior of LoadableComponent to provide post-render listeners


  class CustomLoadableRenderer extends LoadableRenderer {
    componentDidMount() {
      this.afterRender();
    }

    componentDidUpdate() {
      this.afterRender();
    }

    afterRender() {
      const {
        loaded,
        loading,
        error
      } = this.state;
      const {
        onRenderFailure,
        onRenderSuccess
      } = this.props;

      if (!loading) {
        if (error) {
          onRenderFailure(error);
        } else if (loaded && Object.keys(loaded).length > 0) {
          onRenderSuccess();
        }
      }
    }

  }

  CustomLoadableRenderer.defaultProps = void 0;
  CustomLoadableRenderer.defaultProps = defaultProps;
  CustomLoadableRenderer.preload = LoadableRenderer.preload;
  return CustomLoadableRenderer;
}